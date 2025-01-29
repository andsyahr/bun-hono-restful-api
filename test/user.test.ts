import { describe, it, expect, afterEach, beforeEach } from 'bun:test'
import app from '../src'
import { logger } from '../src/application/logging'
import { UserTest } from './test-utils'

describe('POST /api/users', () => {
  afterEach(async () => {
    await UserTest.delete()
  })

  it('should reject register new user if request is invalid', async () => {
    const response = await app.request('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username: '',
        password: '',
        name: ''
      })
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(400)
    expect(body.errors).toBeDefined()
  })

  it('should reject register new user if username already exist', async () => {
    await UserTest.create()

    const response = await app.request('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
        name: 'test'
      })
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(400)
    expect(body.errors).toBeDefined()
  })

  it('should register new user success', async () => {
    const response = await app.request('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username: 'test',
        password: 'test',
        name: 'test'
      })
    })

    const body = await response.json()
    logger.debug(body)

    expect(response.status).toBe(200)
    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')
    expect(body.data.name).toBe('test')
  })
})

describe('POST /api/users/login', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be able to login', async () => {
    const response = await app.request('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username: 'test',
        password: 'test'
      })
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data.token).toBeDefined()
  })

  it('should be rejected if username is invalid', async () => {
    const response = await app.request('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username: 'invalid_username',
        password: 'test'
      })
    })

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  it('should be rejected if password id invalid', async () => {
    const response = await app.request('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username: 'test',
        password: 'invalid_password'
      })
    })

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })
})

describe('GET /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be able to get user', async () => {
    const response = await app.request('/api/users/current', {
      method: 'get',
      headers: {
        Authorization: 'test'
      }
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.data).toBeDefined()
    expect(body.data.username).toBe('test')
    expect(body.data.name).toBe('test')
  })

  it('should not be able to get user if token is invalid', async () => {
    const response = await app.request('/api/users/current', {
      method: 'get',
      headers: {
        Authorization: 'invalid_token'
      }
    })

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  it('should not be able to get user if there is no Authorization header', async () => {
    const response = await app.request('/api/users/current', {
      method: 'get'
    })

    expect(response.status).toBe(401)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })
})

describe('PATCH /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be rejected if request is invalid', async () => {
    const response = await app.request('/api/users/current', {
      method: 'patch',
      headers: {
        Authorization: 'test'
      },
      body: JSON.stringify({
        name: '',
        password: ''
      })
    })

    expect(response.status).toBe(400)

    const body = await response.json()
    expect(body.errors).toBeDefined()
  })

  it('should be able to update name', async () => {
    const response = await app.request('/api/users/current', {
      method: 'patch',
      headers: {
        Authorization: 'test'
      },
      body: JSON.stringify({
        name: 'andsyahr'
      })
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.error(body)

    expect(body.data).toBeDefined()
    expect(body.data.name).toBe('andsyahr')
  })

  it('should be able to update password', async () => {
    let response = await app.request('/api/users/current', {
      method: 'patch',
      headers: {
        Authorization: 'test'
      },
      body: JSON.stringify({
        password: 'new_password'
      })
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.error(body)

    expect(body.data).toBeDefined()
    expect(body.data.name).toBe('test')

    response = await app.request('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username: 'test',
        password: 'new_password'
      })
    })

    expect(response.status).toBe(200)
  })
})

describe('DELETE /api/users/current', () => {
  beforeEach(async () => {
    await UserTest.create()
  })

  afterEach(async () => {
    await UserTest.delete()
  })

  it('should be able to logout', async () => {
    const response = await app.request('/api/users/current', {
      method: 'delete',
      headers: {
        Authorization: 'test'
      }
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.error(body)

    expect(body.data).toBe(true)
  })

  it('should not be able to logout', async () => {
    let response = await app.request('/api/users/current', {
      method: 'delete',
      headers: {
        Authorization: 'test'
      }
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.error(body)

    expect(body.data).toBe(true)

    response = await app.request('/api/users/current', {
      method: 'delete'
    })

    expect(response.status).toBe(401)
  })
})
