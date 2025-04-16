import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    VERCEL_ENV: z.enum(['development', 'production']),
  },

  clientPrefix: 'PUBLIC_',

  client: {},

  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
