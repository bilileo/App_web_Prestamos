"use server";
 
import { revalidatePath } from "next/cache";
import { AssetService } from "../services/asset.service";
import { assetSchema } from "../validations/assetSchema";
import type { FormActionState } from "../../../lib/form-state";
import { toFieldErrors } from "../../../lib/validation";
import { requirePermission } from "../../../lib/authorization";
 
function readAssetFormData(formData: FormData) {
  return {
    code: formData.get("code"),
    name: formData.get("name"),
    description: formData.get("description"),
    serialNumber: formData.get("serialNumber"),
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
  };
}
 
export async function createAssetAction(
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const user = await requirePermission("assets:create", "/assets/new");
  const parsed = assetSchema.safeParse(readAssetFormData(formData));
 
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }
 
  try {
    const asset = await AssetService.createAsset({
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description,
      serialNumber: parsed.data.serialNumber,
      status: parsed.data.status,
      categoryId: parsed.data.categoryId,
      createdById: user.id,
    });
 
    revalidatePath("/assets");
 
    return {
      status: "success",
      message: `Activo ${asset.code} registrado correctamente.`,
      entityId: asset.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar el activo.",
    };
  }
}
 
export async function updateAssetAction(
  id: number,
  _prevState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requirePermission("assets:update");
 
  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador del activo no es válido.",
    };
  }
 
  const parsed = assetSchema.safeParse(readAssetFormData(formData));
 
  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }
 
  try {
    await AssetService.updateAsset(id, {
      code: parsed.data.code,
      name: parsed.data.name,
      description: parsed.data.description,
      serialNumber: parsed.data.serialNumber,
      status: parsed.data.status,
      categoryId: parsed.data.categoryId,
    });
 
    revalidatePath("/assets");
    revalidatePath(`/assets/${id}/edit`);
 
    return {
      status: "success",
      message: `Activo ${parsed.data.code} actualizado correctamente.`,
      entityId: id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al actualizar el activo.",
    };
  }
}
 
export async function deleteAssetAction(id: number): Promise<FormActionState> {
  await requirePermission("assets:delete");
 
  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador del activo no es válido.",
    };
  }
 
  try {
    const asset = await AssetService.deleteAsset(id);
    revalidatePath("/assets");
 
    return {
      status: "success",
      message: `Activo ${asset.code} eliminado correctamente.`,
      entityId: id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error al eliminar el activo.",
    };
  }
}
