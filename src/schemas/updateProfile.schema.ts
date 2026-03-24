import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome muito curto").max(100),
  username: z.string().min(3, "Mín 3 caracteres").max(30),
  bio: z.string().max(500, "Máximo 500 caracteres").optional(),
  media: z.instanceof(File).optional().nullable(),
  skills: z.array(z.string()).optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  footDomain: z.string().optional(),
  position: z.string().optional(),
  birthDate: z.string().optional(),
});

export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;
