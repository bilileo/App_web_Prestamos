# Diagrama del manejo de roles y permisos (RBAC)

El proyecto utiliza dos roles (`ADMIN` y `USER`) y autoriza acciones mediante
permisos, no mediante valores enviados por el cliente. El rol viaja en el JWT,
se valida al reconstruir el usuario y después se consulta la matriz de
permisos.

```mermaid
flowchart TD
    A[Sesión autenticada] --> B[session.user.role]
    B --> C{isRole valida el rol}
    C -- No --> D[Usar USER como rol seguro]
    C -- Sí --> E[Conservar ADMIN o USER]
    D --> F[SessionUser validado]
    E --> F

    F --> G{¿Qué tipo de acceso se solicita?}
    G --> H[Middleware: ¿existe token?]
    G --> I[Servidor: requirePermission]
    G --> J[Interfaz: Can]

    H -- No --> K[Redirigir a /login]
    H -- Sí --> L[Permitir entrada a la ruta]

    I --> M[requireUser]
    M -- Sin sesión --> K
    M -- Con sesión --> N[hasPermission(role, permission)]
    N -- Permitido --> O[Ejecutar acción o renderizar]
    N -- Denegado --> P[forbidden() / página 403]

    J --> Q[hasPermission(role, permission)]
    Q -- Permitido --> R[Mostrar botón o enlace]
    Q -- Denegado --> S[Ocultar o mostrar fallback]

    T[ROLE_PERMISSIONS] --> U[ADMIN: todos los permisos]
    T --> V[USER: dashboard:read<br/>assets:read<br/>categories:read]
    N --> T
    Q --> T
```

## Matriz de autorización

| Rol | Acceso |
|---|---|
| `ADMIN` | Dashboard, lectura/creación/edición/eliminación de activos y categorías, y lectura de usuarios |
| `USER` | Dashboard, lectura de activos y lectura de categorías |

## Capas de protección

1. **Entrada de ruta:** [`proxy.ts`](../proxy.ts) exige un token para
   `/dashboard`, `/assets` y `/categories`.
2. **Servidor:** [`requirePermission`](../src/lib/authorization.ts) obtiene una
   sesión validada y llama a `forbidden()` si el permiso falta. Esta es la
   protección real para páginas y acciones.
3. **Interfaz:** [`Can.tsx`](../src/components/auth/Can.tsx) oculta controles
   que el rol no puede usar; no reemplaza la autorización del servidor.
4. **Navegación:** [`layout.tsx`](<../app/(app)/layout.tsx>) solo agrega el acceso
   a categorías si el usuario tiene `categories:create`.

La fuente de verdad de roles y permisos es
[`constants.ts`](../src/features/auth/constants.ts) y
[`permissions.ts`](../src/features/auth/permissions.ts).
