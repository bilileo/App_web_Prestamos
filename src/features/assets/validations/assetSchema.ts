import { z } from "zod";
import { ASSET_STATUSES } from "../constants";
 
export const assetSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, { message: "El código debe tener al menos 3 caracteres" })
    .max(30, { message: "El código no debe superar 30 caracteres" }),
  name: z
    .string()
    .trim()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .max(120, { message: "El nombre no debe superar 120 caracteres" }),
  description: z
    .string()
    .trim()
    .max(500, { message: "La descripción no debe superar 500 caracteres" })
    .optional(),
  serialNumber: z
    .string()
    .trim()
    .min(3, { message: "El número de serie debe tener al menos 3 caracteres" })
    .max(100, { message: "El número de serie no debe superar 100 caracteres" }),
  categoryId: z.coerce
    .number({ error: "Seleccione una categoría válida" })
    .int({ message: "Seleccione una categoría válida" })
    .positive({ message: "Seleccione una categoría válida" }),
  status: z.enum(ASSET_STATUSES, {
    error: "Seleccione un estado válido",
  }),
});
 
export type AssetInput = z.infer<typeof assetSchema>;
