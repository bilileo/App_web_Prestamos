"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserAction,
  updateUserAction,
} from "@/src/features/auth/actions/user.actions";
import { ROLES, ROLE_LABELS, type Role } from "@/src/features/auth/constants";
import {
  createUserSchema,
  updateUserSchema,
} from "@/src/features/auth/validations/userSchema";
import { useToast } from "@/src/hooks/useToast";
import {
  initialFormState,
  type FieldErrors,
  type FormActionState,
} from "@/src/lib/form-state";
import { toFieldErrors } from "@/src/lib/validation";

type EditableUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type UserFormProps = {
  user?: EditableUser;
};

export default function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    role: user?.role ?? "USER",
  });
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const action = user
    ? updateUserAction.bind(null, user.id)
    : createUserAction;
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(action, initialFormState);

  useEffect(() => {
    if (state.status !== "success") return;

    toast.success(state.message ?? "Operación realizada correctamente.");
    router.push("/users");
    router.refresh();
  }, [router, state.message, state.status, toast]);

  const updateField = (field: keyof typeof values, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setClientErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const schema = user ? updateUserSchema : createUserSchema;
    const parsed = schema.safeParse(values);

    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(toFieldErrors(parsed.error));
      return;
    }

    setClientErrors({});
  };

  const errors: FieldErrors = { ...state.errors, ...clientErrors };
  const fieldError = (field: keyof typeof values) => errors[field]?.[0];

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

      <fieldset disabled={isPending} className="space-y-5">
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
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            maxLength={120}
            autoComplete="name"
            required
            aria-invalid={Boolean(fieldError("name"))}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {fieldError("name") ? (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {fieldError("name")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Correo electrónico <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            maxLength={160}
            autoComplete="email"
            required
            aria-invalid={Boolean(fieldError("email"))}
            aria-describedby={fieldError("email") ? "email-error" : undefined}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          {fieldError("email") ? (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {fieldError("email")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Contraseña {!user && <span className="text-red-500">*</span>}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={(event) => updateField("password", event.target.value)}
            minLength={8}
            maxLength={72}
            autoComplete={user ? "new-password" : "new-password"}
            required={!user}
            aria-invalid={Boolean(fieldError("password"))}
            aria-describedby={
              fieldError("password") ? "password-error" : undefined
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder={user ? "Dejar vacío para conservarla" : undefined}
          />
          {fieldError("password") ? (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {fieldError("password")}
            </p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Rol <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={values.role}
            onChange={(event) => updateField("role", event.target.value)}
            aria-invalid={Boolean(fieldError("role"))}
            aria-describedby={fieldError("role") ? "role-error" : undefined}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
          {fieldError("role") ? (
            <p id="role-error" className="mt-1 text-xs text-red-600">
              {fieldError("role")}
            </p>
          ) : null}
        </div>
      </fieldset>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href="/users"
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
            : user
              ? "Guardar cambios"
              : "Registrar usuario"}
        </button>
      </div>
    </form>
  );
}
