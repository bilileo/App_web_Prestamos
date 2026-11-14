import { z } from "zod";
 
export const loginSchema = z.object({
  email: z
    .email({ message: "Ingresa un correo válido." })
    .max(160, { message: "El correo no debe superar 160 caracteres." })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
    .max(72, { message: "La contraseña no debe superar 72 caracteres." }),
});
 
export type LoginInput = z.infer<typeof loginSchema>;
