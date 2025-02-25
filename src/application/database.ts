import { PrismaClient } from '@prisma/client'
import { logger } from './logging'

export const prismaClient = new PrismaClient({
  log:
    Bun.env.NODE_ENV === 'development'
      ? [
          {
            emit: 'event',
            level: 'query'
          },
          {
            emit: 'event',
            level: 'error'
          },
          {
            emit: 'event',
            level: 'info'
          },
          {
            emit: 'event',
            level: 'warn'
          }
        ]
      : [
          {
            emit: 'event',
            level: 'error'
          }
        ]
})

prismaClient.$on('query', (e) => {
  logger.info(e)
})

prismaClient.$on('error', (e) => {
  logger.error(e)
})

prismaClient.$on('info', (e) => {
  logger.info(e)
})

prismaClient.$on('warn', (e) => {
  logger.warn(e)
})
