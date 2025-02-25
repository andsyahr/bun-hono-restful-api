import { MiddlewareHandler } from 'hono'
import { UserService } from '../service/user-service'
import { verify } from 'hono/jwt'

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const token = authHeader.split(' ')[1]

  const isTokenValid = await verify(token, Bun.env.JWT_SECRET!)

  if (!isTokenValid) {
    return c.json({ message: 'Unauthorized' }, 401)
  }

  const user = await UserService.get(token)

  c.set('user', user)

  await next()
}
