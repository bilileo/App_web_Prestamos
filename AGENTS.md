<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Propósito

Este archivo define la plantilla arquitectónica de los proyectos de este equipo. Al iniciar un proyecto nuevo, conserva esta estructura, el flujo de autenticación y el flujo CRUD de activos; cambia únicamente el dominio, nombres, textos y reglas de negocio que el proyecto requiera. No inventes una arquitectura alternativa sin justificarlo.

## Stack y versiones de referencia

- Next.js 16.3.1 con App Router y React 19.2.
- TypeScript en modo `strict`, alias `@/*` apuntando a la raíz.
- Tailwind CSS 4 y componentes reutilizables en `components/ui`.
- PostgreSQL con Prisma 7, `@prisma/adapter-pg` y cliente generado en `src/generated/prisma`.
- NextAuth 4 con Credentials Provider y sesiones JWT.
- Zod 4 para validar entradas; Zustand solo para estado global de interfaz cuando sea necesario.
- pnpm como único gestor de paquetes. No uses npm ni yarn.

## Estructura obligatoria

Mantén esta separación de responsabilidades:

```text
app/
  (auth)/layout.tsx
  (auth)/login/page.tsx
  (app)/layout.tsx
  (app)/dashboard/page.tsx
  (app)/assets/page.tsx
  (app)/assets/new/page.tsx
  (app)/assets/[id]/edit/page.tsx
  (app)/assets/loading.tsx
  (app)/assets/error.tsx
  (app)/categories/new/page.tsx
  api/auth/[...nextauth]/route.ts
  api/assets/route.ts
  layout.tsx
  globals.css
components/
  layout/Navbar.tsx
  layout/Sidebar.tsx
  ui/                 # primitivos compartidos; no modificar si son generados
src/
  actions/             # solo si una acción no pertenece a una feature
  components/
    auth/
    assets/
    AssetForm.tsx
    CategoryForm.tsx
  features/
    auth/{constants.ts,validations/}
    assets/{actions,constants.ts,services,types.ts,validations}
    categories/{actions,services}
  hooks/
  lib/
    auth.ts
    form-state.ts
    prisma.ts
    session.ts
    validation.ts
  stores/
  types/next-auth.d.ts
prisma/
  schema.prisma
  migrations/
  seed.ts
proxy.ts
prisma7.config.ts
```

Las páginas y route handlers deben ser delgados. La lógica de consultas pertenece a `src/features/*/services`, las mutaciones a Server Actions en `actions`, y las validaciones reutilizables a `validations`. Usa imports `@/`; evita rutas relativas profundas.

## Autenticación obligatoria

Implementa siempre el flujo completo, no solo la pantalla de login:

1. `src/lib/auth.ts` exporta `authOptions` de NextAuth:
   - `CredentialsProvider`.
   - Valida `credentials` con `loginSchema.safeParse`.
   - Busca el usuario por email mediante Prisma.
   - Compara la contraseña con `bcryptjs`; nunca guardes contraseñas en texto plano.
   - Usa `strategy: "jwt"`, un `maxAge` explícito y `NEXTAUTH_SECRET`.
   - Propaga al JWT y a `session.user` los campos necesarios, como `id` y `role`.
   - Configura `signIn` y `error` hacia `/login`.
2. `app/api/auth/[...nextauth]/route.ts` crea el handler GET/POST con `runtime = "nodejs"`.
3. `src/types/next-auth.d.ts` amplía los tipos de `Session`, `User` y `JWT`; no uses `any`.
4. `src/lib/session.ts` expone:
   - `getCurrentUser()` para devolver un usuario validado o `null`.
   - `requireUser(callbackUrl?)` para redirigir a `/login` cuando no exista sesión.
5. `proxy.ts` usa `withAuth` y protege como mínimo `/dashboard/:path*`, `/assets/:path*` y `/categories/:path*`. El `proxy` no sustituye la comprobación en servidor.
6. El layout de `(app)` debe llamar a `requireUser()` antes de renderizar Navbar, Sidebar y contenido. Las Server Actions y route handlers también deben comprobar la sesión.
7. El layout de `(auth)` solo contiene la composición visual del login y no debe consultar la base de datos.

Para roles, define una tupla `as const`, su tipo derivado, etiquetas y un type guard (`isRole`). No confíes en un rol recibido del cliente ni en un valor JWT sin validarlo.

## Flujo estándar de activos

El módulo de activos debe conservar este recorrido:

1. `app/(app)/assets/page.tsx` es Server Component. Lee `searchParams`, los valida con `parseAssetFilters`, obtiene activos y categorías directamente desde servicios y renderiza tabla, filtros, paginación y acciones.
2. `src/features/assets/validations/assetSchema.ts` define el contrato Zod del formulario y exporta el tipo inferido.
3. `src/features/assets/services/asset.service.ts` concentra Prisma, paginación, búsqueda insensible a mayúsculas, filtros, relaciones y reglas de unicidad. Limita `pageSize` y traduce errores de restricciones únicas a errores de dominio.
4. `src/features/assets/actions/asset.actions.ts` usa `"use server"`, llama primero a `requireUser()`, valida `FormData` con Zod, invoca el servicio, ejecuta `revalidatePath` y devuelve un `FormActionState` tipado. Nunca confíes solo en la validación del cliente.
5. `src/components/AssetForm.tsx` es Client Component únicamente porque necesita estado, `useActionState`, efectos y eventos del navegador. Puede validar previamente con el mismo schema para UX, pero el servidor siempre vuelve a validar.
6. Las acciones de crear, editar y eliminar deben validar identificadores, controlar errores explícitamente y conservar mensajes de error útiles. No ocultes excepciones con catches vacíos.
7. `app/api/assets/route.ts`, si existe, debe autenticar cada método, validar query/body con los schemas compartidos y devolver códigos HTTP explícitos. Los Server Components no deben hacer fetch a esta API propia.
8. Las categorías siguen el mismo patrón `actions` → `services` y no se pueden eliminar si tienen activos asociados.

Al agregar otra feature, replica el patrón `constants`, `types`, `validations`, `services`, `actions` y componentes de feature. No pongas consultas Prisma directamente en componentes de presentación.

## Persistencia y Prisma

- `prisma/schema.prisma` es la fuente del modelo y usa `provider = "prisma-client"` con salida `../src/generated/prisma`.
- `src/lib/prisma.ts` crea un único `PrismaClient` con `PrismaPg` y `DATABASE_URL`; reutilízalo en desarrollo mediante `globalThis`.
- Mantén `prisma7.config.ts` con schema, migraciones, seed y `DATABASE_URL`.
- Después de cambiar el schema, crea una migración con Prisma y regenera el cliente. No edites `src/generated/prisma` manualmente.
- Define relaciones, índices, unicidad y `onDelete` de forma explícita. Los campos de auditoría deben conservar `createdAt` y `updatedAt` cuando apliquen.
- Nunca expongas `passwordHash`, secretos ni datos internos en respuestas o props serializadas.

## Server Components, UI y estilos

- Usa Server Components por defecto; agrega `"use client"` solo en componentes hoja que necesiten estado, efectos o eventos del navegador.
- Usa `next/link`, `next/navigation` y APIs de Next.js desde sus módulos públicos; no importes rutas internas de `next`.
- Mantén `app/` para composición de rutas y `src/` para lógica reusable.
- Conserva layouts separados para autenticación y aplicación, con Navbar, Sidebar y Toaster en el layout raíz/aplicación según corresponda.
- Reutiliza los primitivos existentes de `components/ui`; no modifiques archivos generados automáticamente.
- Usa clases Tailwind existentes antes de crear estilos globales. La interfaz base usa español, estados claros de carga/error/éxito y navegación accesible.

## Variables de entorno y seguridad

Parte siempre de `.env.example` y crea `.env` local sin subirlo al repositorio:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="secreto-generado-localmente"
```

`NEXTAUTH_SECRET` y `DATABASE_URL` son secretos. No los incluyas en código, commits, logs, respuestas del navegador ni variables `NEXT_PUBLIC_*`. No copies valores reales al crear otro proyecto; genera credenciales nuevas.

## Comandos y verificación

Ejecuta desde la raíz y usa pnpm:

```bash
pnpm dev
pnpm exec tsc --noEmit
pnpm lint
pnpm test
pnpm build
```

Antes de terminar cualquier cambio de código, ejecuta al menos `pnpm exec tsc --noEmit` y `pnpm lint`; para cambios de servicios o acciones, ejecuta también las pruebas enfocadas. Si falta un script o una dependencia, inspecciona `package.json` y reporta el problema antes de cambiar el contrato del proyecto.

## Límites de cambios

- No cambies archivos no relacionados ni reviertas cambios previos del usuario.
- No instales dependencias sin confirmación.
- No uses `any`, casts indiscriminados ni `fetch` a `/api/*` desde Server Components.
- No uses `npm`, `yarn`, ni edites `.next`, `node_modules`, `src/generated/prisma`, migraciones ya aplicadas o archivos de caché como si fueran código fuente.
- No guardes secretos ni borres datos de la base sin confirmación explícita.
- Si una decisión de diseño puede romper la estructura, detente y solicita aclaración; de lo contrario, implementa la solución mínima que conserve este patrón.
