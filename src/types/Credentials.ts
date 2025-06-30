import { z } from 'zod';

export const credentialsSchema = z.object({
  token: z.string(),
  siteId: z.string(),
  userId: z.string().optional(),
});

export type Credentials = z.infer<typeof credentialsSchema>;