"use server";

import { revalidatePath } from "next/cache";
import type { FormActionState } from "@/src/lib/form-state";
import { requirePermission } from "@/src/lib/authorization";
import { toFieldErrors } from "@/src/lib/validation";
import { CategoryService } from "@/src/features/categories/services/category.service";
import { categorySchema } from "@/src/features/categories/validations/categorySchema";

function readCategoryFormData(formData: FormData) {
  return {
    name: formData.get("name")?.toString() ?? "",
  };
}

function revalidateCategoryPages() {
  revalidatePath("/categories");
  revalidatePath("/assets");
  revalidatePath("/assets/new");
}

export async function createCategoryAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requirePermission("categories:create", "/categories/new");

  const parsed = categorySchema.safeParse(readCategoryFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }

  try {
    const category = await CategoryService.createCategory(parsed.data);
    revalidateCategoryPages();

    return {
      status: "success",
      message: `Categoría '${category.name}' creada correctamente.`,
      entityId: category.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No fue posible crear la categoría.",
    };
  }
}

export async function updateCategoryAction(
  id: number,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requirePermission("categories:update", `/categories/${id}/edit`);

  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador de la categoría no es válido.",
    };
  }

  const parsed = categorySchema.safeParse(readCategoryFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }

  try {
    const category = await CategoryService.updateCategory(id, parsed.data);
    revalidateCategoryPages();

    return {
      status: "success",
      message: `Categoría '${category.name}' actualizada correctamente.`,
      entityId: category.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No fue posible actualizar la categoría.",
    };
  }
}

export async function deleteCategoryAction(
  id: number,
): Promise<FormActionState> {
  await requirePermission("categories:delete", "/categories");

  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador de la categoría no es válido.",
    };
  }

  try {
    const category = await CategoryService.deleteCategory(id);
    revalidateCategoryPages();

    return {
      status: "success",
      message: `Categoría '${category.name}' eliminada correctamente.`,
      entityId: category.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No fue posible eliminar la categoría.",
    };
  }
}
