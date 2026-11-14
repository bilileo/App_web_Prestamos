# Diagrama del flujo de autenticación con NextAuth

Este diagrama representa el flujo implementado actualmente en el proyecto:
Credentials Provider, sesiones JWT y validación de sesión en middleware, Server
Components y cliente.

```mermaid
sequenceDiagram
    autonumber
    actor U as Usuario
    participant C as Cliente<br/>(LoginForm)
    participant R as Next.js<br/>/api/auth/[...nextauth]
    participant P as Credentials Provider
    participant DB as PostgreSQL<br/>(Prisma)
    participant J as Callback jwt
    participant S as Callback session
    participant K as Cookie de sesión<br/>JWT firmado
    participant M as Middleware<br/>(proxy.ts)
    participant SV as Servidor<br/>(getServerSession)

    U->>C: Escribe correo y contraseña
    U->>C: Clic en "Iniciar sesión"
    C->>R: signIn("credentials", datos)
    R->>P: authorize(credentials)
    P->>P: Valida datos con loginSchema
    P->>DB: Busca usuario por correo
    DB-->>P: Usuario y passwordHash
    P->>P: bcrypt.compare(password, passwordHash)

    alt Credenciales inválidas
        P-->>R: null
        R-->>C: Error de inicio de sesión
        C-->>U: Muestra mensaje y permanece en /login
    else Credenciales válidas
        P-->>R: id, nombre, correo y role
        R->>J: jwt({ token, user })
        J->>J: token.id = user.id<br/>token.role = user.role
        J-->>R: JWT con identidad y rol
        R->>K: Firma y guarda la sesión JWT
        R->>S: session({ session, token })
        S->>S: session.user.id = token.id<br/>session.user.role = token.role
        S-->>R: Sesión enriquecida
        R-->>C: Sesión creada y redirección
        C-->>U: Acceso a la aplicación
    end

    U->>M: Solicita /dashboard, /assets o /categories
    M->>K: Lee el JWT de la cookie
    alt No existe token
        M-->>U: Redirección a /login
    else Existe token
        M-->>SV: Permite continuar
        SV->>K: getServerSession(authOptions)
        K-->>SV: Sesión con id y role
        SV->>SV: getCurrentUser() valida id y role
        SV-->>U: Renderiza contenido protegido
    end

    Note over C,SV: En cliente se consume la sesión con useSession<br/>y en servidor con getServerSession(authOptions).
```

## Lectura del flujo

1. `LoginForm` inicia `signIn` contra el endpoint de NextAuth.
2. `CredentialsProvider` valida el formulario, consulta PostgreSQL mediante
   Prisma y compara la contraseña con `bcryptjs`.
3. El callback `jwt` copia `id` y `role` al token.
4. El callback `session` expone esos datos como `session.user.id` y
   `session.user.role`.
5. `proxy.ts` bloquea las rutas protegidas cuando no hay token.
6. El servidor vuelve a verificar la sesión con `getServerSession`; el
   middleware no sustituye esta comprobación.

Archivos relacionados: [`auth.ts`](../src/lib/auth.ts), [`session.ts`](../src/lib/session.ts),
[`proxy.ts`](../proxy.ts) y [`LoginForm.tsx`](../src/components/auth/LoginForm.tsx).
