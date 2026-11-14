"use client";
 
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAssetAction,
  updateAssetAction,
} from "@/src/features/assets/actions/asset.actions";
import {
  ASSET_STATUS_OPTIONS,
  type AssetStatus,
} from "@/src/features/assets/constants";
import type { AssetFormValues } from "@/src/features/assets/types";
import { assetSchema } from "@/src/features/assets/validations/assetSchema";
import { useToast } from "@/src/hooks/useToast";
import {
  initialFormState,
  type FieldErrors,
  type FormActionState,
} from "@/src/lib/form-state";
import { toFieldErrors } from "@/src/lib/validation";
 
type Category = {
  id: number;
  name: string;
};
 
type EditableAsset = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  serialNumber: string | null;
  categoryId: number;
  status: string;
};
 
type AssetFormProps = {
  categories: Category[];
  asset?: EditableAsset;
};
 
function buildInitialValues(asset?: EditableAsset): AssetFormValues {
  return {
    code: asset?.code ?? "",
    name: asset?.name ?? "",
    description: asset?.description ?? "",
    serialNumber: asset?.serialNumber ?? "",
    categoryId: asset?.categoryId.toString() ?? "",
    status: (asset?.status ?? "AVAILABLE") as AssetStatus,
  };
}
 
export default function AssetForm({ categories, asset }: AssetFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [values, setValues] = useState<AssetFormValues>(() =>
    buildInitialValues(asset),
  );
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
 
  const action = asset
    ? updateAssetAction.bind(null, asset.id)
    : createAssetAction;
 
  const [state, formAction, isPending] = useActionState<
    FormActionState,
    FormData
  >(action, initialFormState);
 
  useEffect(() => {
    if (state.status !== "success") return;
 
    toast.success(state.message ?? "Operación realizada correctamente.");
    router.push("/assets");
  }, [state.status, state.message, toast, router]);
 
  const updateField = <K extends keyof AssetFormValues>(
    field: K,
    value: AssetFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [field]: value }));
    setClientErrors((current) => {
      if (!current[field]) return current;
 
      const next = { ...current };
      delete next[field];
      return next;
    });
  };
 
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const parsed = assetSchema.safeParse(values);
 
    if (!parsed.success) {
      event.preventDefault();
      setClientErrors(toFieldErrors(parsed.error));
      return;
    }
 
    setClientErrors({});
  };
 
  const errors: FieldErrors = { ...state.errors, ...clientErrors };
  const fieldError = (field: keyof AssetFormValues) => errors[field]?.[0];
 
  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
    >
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      )}
 
      <fieldset disabled={isPending} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="code"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Código <span className="text-red-500">*</span>
            </label>
            <input
              id="code"
              name="code"
              value={values.code}
              onChange={(event) => updateField("code", event.target.value)}
              maxLength={30}
              autoComplete="off"
              aria-invalid={Boolean(fieldError("code"))}
              aria-describedby={fieldError("code") ? "code-error" : undefined}
              className="w-full rounded-md border  text-black  border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="CPU-001"
            />
            {fieldError("code") && (
              <p id="code-error" className="mt-1 text-xs text-red-600">
                {fieldError("code")}
              </p>
            )}
          </div>
 
          <div>
            <label
              htmlFor="serialNumber"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Número de serie <span className="text-red-500">*</span>
            </label>
            <input
              id="serialNumber"
              name="serialNumber"
              value={values.serialNumber}
              onChange={(event) =>
                updateField("serialNumber", event.target.value)
              }
              maxLength={100}
              autoComplete="off"
              aria-invalid={Boolean(fieldError("serialNumber"))}
              aria-describedby={
                fieldError("serialNumber") ? "serialNumber-error" : undefined
              }
              className="w-full rounded-md border  text-black  border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="SN-2026-001"
            />
            {fieldError("serialNumber") && (
              <p id="serialNumber-error" className="mt-1 text-xs text-red-600">
                {fieldError("serialNumber")}
              </p>
            )}
          </div>
        </div>
 
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
            aria-invalid={Boolean(fieldError("name"))}
            aria-describedby={fieldError("name") ? "name-error" : undefined}
            className="w-full text-black rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Dell OptiPlex 7090"
          />
          {fieldError("name") && (
            <p id="name-error" className="mt-1 text-xs text-red-600">
              {fieldError("name")}
            </p>
          )}
        </div>
 
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            maxLength={500}
            aria-invalid={Boolean(fieldError("description"))}
            aria-describedby={
              fieldError("description") ? "description-error" : undefined
            }
            className="w-full rounded-md border  text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="Equipo de escritorio del área de TI"
          />
          {fieldError("description") && (
            <p id="description-error" className="mt-1 text-xs text-red-600">
              {fieldError("description")}
            </p>
          )}
        </div>
 
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="categoryId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={values.categoryId}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
              aria-invalid={Boolean(fieldError("categoryId"))}
              aria-describedby={
                fieldError("categoryId") ? "categoryId-error" : undefined
              }
              className="w-full rounded-md border  text-black  border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldError("categoryId") && (
              <p id="categoryId-error" className="mt-1 text-xs text-red-600">
                {fieldError("categoryId")}
              </p>
            )}
          </div>
 
          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={values.status}
              onChange={(event) =>
                updateField("status", event.target.value as AssetStatus)
              }
              aria-invalid={Boolean(fieldError("status"))}
              aria-describedby={
                fieldError("status") ? "status-error" : undefined
              }
              className="w-full rounded-md border  text-black border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              {ASSET_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {fieldError("status") && (
              <p id="status-error" className="mt-1 text-xs text-red-600">
                {fieldError("status")}
              </p>
            )}
          </div>
        </div>
 
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/assets"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending
              ? "Guardando..."
              : asset
                ? "Guardar cambios"
                : "Registrar activo"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
