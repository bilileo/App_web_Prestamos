"use client";
 
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { loginSchema } from "@/src/features/auth/validations/login";
import { toFieldErrors } from "@/src/lib/validation";
 
type LoginFormProps = {
  callbackUrl: string;
};
 
export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");
 
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
 
    const formData = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
 
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }
 
    setErrors({});
 
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
        callbackUrl,
      });
 
      if (!result?.ok) {
        setMessage("Correo o contraseña incorrectos.");
        return;
      }
 
      router.push(callbackUrl);
      router.refresh();
    });
  }
 
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        Gestión de Activos
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Ingresa con tu cuenta institucional para continuar.
      </p>
 
      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.email?.[0] ? (
            <p id="email-error" className="mt-1 text-xs text-red-600">
              {errors.email[0]}
            </p>
          ) : null}
        </div>
 
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {errors.password?.[0] ? (
            <p id="password-error" className="mt-1 text-xs text-red-600">
              {errors.password[0]}
            </p>
          ) : null}
        </div>
 
        {message ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {message}
          </p>
        ) : null}
 
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isPending ? "Ingresando…" : "Ingresar"}
        </button>
      </form>
    </section>
  );
}
