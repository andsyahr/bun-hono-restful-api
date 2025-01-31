import { describe, it, expect, afterEach, beforeEach } from 'bun:test'
import { AddressTest, ContactTest, UserTest } from './test-utils'
import app from '../src'
import { logger } from '../src/application/logging'

describe('POST /api/contacts/{id}/addresses', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()

    await UserTest.create()
    await ContactTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if request is invalid', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: 'post',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          country: '',
          postal_code: ''
        })
      }
    )

    expect(response.status).toBe(400)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should rejected if contact is not found', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id + 1}/addresses`,
      {
        method: 'post',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          country: 'Indonesia',
          postal_code: '1112'
        })
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should success if request is valid', async () => {
    const contact = await ContactTest.get()
    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: 'post',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          street: 'Jalan',
          city: 'Kota',
          province: 'Provinsi',
          country: 'Indonesia',
          postal_code: '12345'
        })
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.debug(body)

    expect(body.data).toBeDefined()
    expect(body.data.id).toBeDefined()
    expect(body.data.street).toBe('Jalan')
    expect(body.data.city).toBe('Kota')
    expect(body.data.province).toBe('Provinsi')
    expect(body.data.country).toBe('Indonesia')
    expect(body.data.postal_code).toBe('12345')
  })
})

describe('GET /api/contacts/{contact_id}/addresses/{address_id}', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if address is not found', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: 'get',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should success if address is exist', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'get',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.debug(body)

    expect(body.data).toBeDefined()
    expect(body.data.id).toBeDefined()
    expect(body.data.street).toBe('Jalan')
    expect(body.data.city).toBe('Kota')
    expect(body.data.province).toBe('Provinsi')
    expect(body.data.country).toBe('Indonesia')
    expect(body.data.postal_code).toBe('12345')
  })
})

describe('PUT /api/contacts/{contact_id}/addresses/{address_id}', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if request is invalid', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'put',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          country: '',
          postal_code: ''
        })
      }
    )

    expect(response.status).toBe(400)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should rejected if address is not found', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: 'put',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          country: 'Indonesia',
          postal_code: '12345'
        })
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should success if request is valid', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'put',
        headers: {
          Authorization: 'test'
        },
        body: JSON.stringify({
          street: 'Jalan 2',
          city: 'Kota 2',
          province: 'Provinsi 2',
          country: 'Indonesia',
          postal_code: '12345'
        })
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.debug(body)

    expect(body.data).toBeDefined()
    expect(body.data.id).toBeDefined()
    expect(body.data.street).toBe('Jalan 2')
    expect(body.data.city).toBe('Kota 2')
    expect(body.data.province).toBe('Provinsi 2')
    expect(body.data.country).toBe('Indonesia')
    expect(body.data.postal_code).toBe('12345')
  })
})

describe('DELETE /api/contacts/{contact_id}/addresses/{address_id}', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if address is not exist', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id + 1}`,
      {
        method: 'delete',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should success if address is exist', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses/${address.id}`,
      {
        method: 'delete',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.debug(body)

    expect(body.data).toBeDefined()
    expect(body.data).toBeTrue()
  })
})

describe('GET /api/contacts/{contact_id}/addresses', () => {
  beforeEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()

    await UserTest.create()
    await ContactTest.create()
    await AddressTest.create()
  })

  afterEach(async () => {
    await AddressTest.deleteAll()
    await ContactTest.deleteAll()
    await UserTest.delete()
  })

  it('should rejected if contact id is not found', async () => {
    const contact = await ContactTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id + 1}/addresses`,
      {
        method: 'get',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(404)

    const body = await response.json()
    logger.debug(body)

    expect(body.errors).toBeDefined()
  })

  it('should success if contact is exist', async () => {
    const contact = await ContactTest.get()
    const address = await AddressTest.get()

    const response = await app.request(
      `/api/contacts/${contact.id}/addresses`,
      {
        method: 'get',
        headers: {
          Authorization: 'test'
        }
      }
    )

    expect(response.status).toBe(200)

    const body = await response.json()
    logger.debug(body)

    expect(body.data).toBeDefined()
    expect(body.data.length).toBe(1)
    expect(body.data[0].id).toBe(address.id)
    expect(body.data[0].city).toBe(address.city)
    expect(body.data[0].province).toBe(address.province)
    expect(body.data[0].country).toBe(address.country)
    expect(body.data[0].postal_code).toBe(address.postal_code)
  })
})
