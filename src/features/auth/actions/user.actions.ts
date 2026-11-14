"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/src/lib/authorization";
import type { FormActionState } from "@/src/lib/form-state";
import { toFieldErrors } from "@/src/lib/validation";
import { UserService } from "../services/user.service";
import {
  createUserSchema,
  updateUserSchema,
} from "../validations/userSchema";

function readUserFormData(formData: FormData) {
  return {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    password: formData.get("password")?.toString() ?? "",
    role: formData.get("role")?.toString() ?? "",
  };
}

function revalidateUserPages() {
  revalidatePath("/users");
  revalidatePath("/dashboard");
}

export async function createUserAction(
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  await requirePermission("users:create", "/users/new");

  const parsed = createUserSchema.safeParse(readUserFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }

  try {
    const user = await UserService.createUser(parsed.data);
    revalidateUserPages();

    return {
      status: "success",
      message: `Usuario '${user.name}' creado correctamente.`,
      entityId: user.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "No fue posible crear el usuario.",
    };
  }
}

export async function updateUserAction(
  id: number,
  _previousState: FormActionState,
  formData: FormData,
): Promise<FormActionState> {
  const currentUser = await requirePermission(
    "users:update",
    `/users/${id}/edit`,
  );

  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador del usuario no es válido.",
    };
  }

  const parsed = updateUserSchema.safeParse(readUserFormData(formData));

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: toFieldErrors(parsed.error),
    };
  }

  if (id === currentUser.id && parsed.data.role !== currentUser.role) {
    return {
      status: "error",
      message: "No puedes cambiar tu propio rol desde la sesión actual.",
    };
  }

  try {
    const user = await UserService.updateUser(id, parsed.data);
    revalidateUserPages();

    return {
      status: "success",
      message: `Usuario '${user.name}' actualizado correctamente.`,
      entityId: user.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No fue posible actualizar el usuario.",
    };
  }
}

export async function deleteUserAction(id: number): Promise<FormActionState> {
  const currentUser = await requirePermission("users:delete", "/users");

  if (!Number.isInteger(id) || id <= 0) {
    return {
      status: "error",
      message: "El identificador del usuario no es válido.",
    };
  }

  try {
    const user = await UserService.deleteUser(id, currentUser.id);
    revalidateUserPages();

    return {
      status: "success",
      message: `Usuario '${user.name}' eliminado correctamente.`,
      entityId: user.id,
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "No fue posible eliminar el usuario.",
    };
  }
}
