import { z } from "zod";
import { ROLES } from "../constants";

const userFields = {
  name: z
    .string()
    .trim()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(120, { message: "El nombre no debe superar 120 caracteres." }),
  email: z
    .email({ message: "Ingresa un correo válido." })
    .max(160, { message: "El correo no debe superar 160 caracteres." })
    .trim()
    .toLowerCase(),
  role: z.enum(ROLES, {
    message: "Selecciona un rol válido.",
  }),
};

const passwordSchema = z
  .string()
  .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
  .max(72, { message: "La contraseña no debe superar 72 caracteres." });

export const createUserSchema = z.object({
  ...userFields,
  password: passwordSchema,
});

export const updateUserSchema = z.object({
  ...userFields,
  password: z.preprocess(
    (value) => (value === "" ? undefined : value),
    passwordSchema.optional(),
  ),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
