"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/src/features/categories/actions/category.actions";
import { categorySchema } from "@/src/features/categories/validations/categorySchema";
import { useToast } from "@/src/hooks/useToast";
import {
  initialFormState,
  type FieldErrors,
  type FormActionState,
} from "@/src/lib/form-state";
import { toFieldErrors } from "@/src/lib/validation";

type EditableCategory = {
  id: number;
  name: string;
};

type CategoryFormProps = {
  category?: EditableCategory;
};

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(category?.name ?? "");
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(action, initialFormState);

  useEffect(() => {
    if (state.status !== "success") return;

    toast.success(state.message ?? "Operación realizada correctamente.");
    router.push("/categories");
    router.refresh();
  }, [router, state.message, state.status, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = categorySchema.safeParse({ name });

    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(toFieldErrors(parsed.error));
      return;
    }

    setClientErrors({});
  };

  const errors: FieldErrors = { ...state.errors, ...clientErrors };
  const nameError = errors.name?.[0];

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
    >
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Nombre <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setClientErrors({});
          }}
          maxLength={80}
          autoComplete="off"
          required
          aria-invalid={Boolean(nameError)}
          aria-describedby={nameError ? "name-error" : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          placeholder="Computadoras"
        />
        {nameError ? (
          <p id="name-error" className="mt-1 text-xs text-red-600">
            {nameError}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/categories"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending
            ? "Guardando..."
            : category
              ? "Guardar cambios"
              : "Registrar categoría"}
        </button>
      </div>
    </form>
  );
}
