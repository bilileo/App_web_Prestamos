import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(80, { message: "El nombre no debe superar 80 caracteres." }),
});

export type CategoryInput = z.infer<typeof categorySchema>;
