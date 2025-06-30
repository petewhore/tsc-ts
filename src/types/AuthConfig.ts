import { z } from 'zod';

export const authConfigSchema = z.object({
  username: z.string(),
  password: z.string().optional(),
  token_name: z.string().optional(),
  token_value: z.string().optional(),
  site_id: z.string().optional(),
  site_url: z.string().optional(),
});

export type AuthConfig = z.infer<typeof authConfigSchema>;

export interface AuthHeaders {
  headers: {
    'X-Tableau-Auth': string;
  };
}