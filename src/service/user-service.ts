import { sign } from 'hono/jwt'
import { User } from '@prisma/client'
import { prismaClient } from '../application/database'
import {
  LoginUserRequest,
  RegisterUserRequest,
  toUserResponse,
  UpdateUserRequest,
  UserResponse
} from '../model/user-model'
import { UserValidation } from '../validation/user-validation'
import { HTTPException } from 'hono/http-exception'

export class UserService {
  static async register(request: RegisterUserRequest): Promise<UserResponse> {
    request = UserValidation.REGISTER.parse(request)

    const checkDuplicateUsername = await prismaClient.user.count({
      where: {
        username: request.username
      }
    })

    if (checkDuplicateUsername != 0) {
      throw new HTTPException(400, {
        message: 'Username already exists'
      })
    }

    request.password = await Bun.password.hash(request.password, {
      algorithm: 'bcrypt',
      cost: 10
    })

    const user = await prismaClient.user.create({
      data: request
    })

    return toUserResponse(user)
  }

  static async login(request: LoginUserRequest): Promise<UserResponse> {
    request = UserValidation.LOGIN.parse(request)

    let user = await prismaClient.user.findUnique({
      where: {
        username: request.username
      }
    })

    const payload = {
      sub: request.username,
      role: 'user',
      exp:
        Math.floor(Date.now() / 1000) + 60 * 60 * Number(Bun.env.JWT_EXPIRES_IN)
    }

    const secret = Bun.env.JWT_SECRET!

    if (!user) {
      throw new HTTPException(401, {
        message: 'Username or password is invalid'
      })
    }

    const isPasswordValid = await Bun.password.verify(
      request.password,
      user.password,
      'bcrypt'
    )

    if (!isPasswordValid) {
      throw new HTTPException(401, {
        message: 'Username or password is invalid'
      })
    }

    user = await prismaClient.user.update({
      where: {
        username: request.username
      },
      data: {
        token: await sign(payload, secret)
      }
    })

    const response = toUserResponse(user)
    response.token = user.token!

    return response
  }

  static async get(token: string | undefined | null): Promise<User> {
    const result = UserValidation.TOKEN.safeParse(token)

    if (result.error) {
      throw new HTTPException(401, {
        message: 'Unauthorized'
      })
    }

    token = result.data

    const user = await prismaClient.user.findFirst({
      where: {
        token: token
      }
    })

    if (!user) {
      throw new HTTPException(401, {
        message: 'Unauthorized'
      })
    }

    return user
  }

  static async update(
    user: User,
    request: UpdateUserRequest
  ): Promise<UserResponse> {
    request = UserValidation.UPDATE.parse(request)

    if (request.name) {
      user.name = request.name
    }

    if (request.password) {
      user.password = await Bun.password.hash(request.password, {
        algorithm: 'bcrypt',
        cost: 10
      })
    }

    user = await prismaClient.user.update({
      where: {
        username: user.username
      },
      data: user
    })

    return toUserResponse(user)
  }

  static async logout(user: User): Promise<boolean> {
    await prismaClient.user.update({
      where: {
        username: user.username
      },
      data: {
        token: null
      }
    })

    return true
  }
}
