-- 1. Agrega las columnas nuevas. passwordHash nace nullable a proposito
--    para poder rellenar los usuarios que ya existen.
ALTER TABLE "User"
  ADD COLUMN "passwordHash" TEXT,
  ADD COLUMN "role" TEXT NOT NULL DEFAULT 'USER';
 
-- 2. Rellena los usuarios existentes con la contrasena temporal del seed.
--    El hash corresponde a Activos2026! (bcrypt, costo 10).
UPDATE "User"
SET "passwordHash" = '$2b$10$wreAWsxX.cxRycUpr7rIce9x7sjkQouHhohT9J0FumiW6osjy2Xva'
WHERE "passwordHash" IS NULL;
 
-- 3. Ahora si, la columna es obligatoria.
ALTER TABLE "User"
  ALTER COLUMN "passwordHash" SET NOT NULL;

