import { Contact } from '@prisma/client'

export type CreateContactRequest = {
  first_name: string
  last_name?: string
  phone?: string
  email?: string
}

export type UpdateContactRequest = {
  id: number
  first_name: string
  last_name?: string
  phone?: string
  email?: string
}

export type SearchContactRequest = {
  name?: string
  phone?: string
  email?: string
  page: number
  size: number
}

export type ContactResponse = {
  id: number
  first_name: string
  last_name?: string | null
  phone?: string | null
  email?: string | null
}

export function toContactResponse(contact: Contact): ContactResponse {
  return {
    id: contact.id,
    first_name: contact.first_name,
    last_name: contact.last_name,
    email: contact.email,
    phone: contact.phone
  }
}
