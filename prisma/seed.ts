import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";
 
const DEFAULT_PASSWORD = "Activos2026!";
 
async function main() {
  console.log("Iniciando proceso de seeding...");
 
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
 
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@empresa.com" },
    update: { passwordHash, role: "ADMIN" },
    create: {
      name: "Administrador del Sistema",
      email: "admin@empresa.com",
      passwordHash,
      role: "ADMIN",
    },
  });
 
  await prisma.user.upsert({
    where: { email: "soporte@empresa.com" },
    update: { passwordHash, role: "USER" },
    create: {
      name: "Tecnico de Soporte",
      email: "soporte@empresa.com",
      passwordHash,
      role: "USER",
    },
  });

  const catComputadoras = await prisma.category.upsert({
    where: { name: "Computadoras de Escritorio" },
    update: {}, create: { name: "Computadoras de Escritorio" },
  });
  const catLaptops = await prisma.category.upsert({
    where: { name: "Laptops y Notebooks" },
    update: {}, create: { name: "Laptops y Notebooks" },
  });
  const catMonitores = await prisma.category.upsert({
    where: { name: "Monitores y Pantallas" },
    update: {}, create: { name: "Monitores y Pantallas" },
  });
  const catTeclados = await prisma.category.upsert({
    where: { name: "Teclados y Mouse" },
    update: {}, create: { name: "Teclados y Mouse" },
  });
  const catImpresoras = await prisma.category.upsert({
    where: { name: "Impresoras" },
    update: {}, create: { name: "Impresoras" },
  });
  const catServidores = await prisma.category.upsert({
    where: { name: "Servidores" },
    update: {}, create: { name: "Servidores" },
  });
  const catRedes = await prisma.category.upsert({
    where: { name: "Equipos de Red" },
    update: {}, create: { name: "Equipos de Red" },
  });
  const catAccesorios = await prisma.category.upsert({
    where: { name: "Accesorios de Computo" },
    update: {}, create: { name: "Accesorios de Computo" },
  });

  await prisma.asset.upsert({
    where: { code: "CPU-001" },
    update: { status: "AVAILABLE" },
    create: {
      code: "CPU-001", name: "Dell OptiPlex 7090 Tower",
      status: "AVAILABLE",
      categoryId: catComputadoras.id, createdById: adminUser.id,
    },
  });
  await prisma.asset.upsert({
    where: { code: "MON-001" },
    update: {},
    create: {
      code: "MON-001", name: "Monitor Dell UltraSharp 27",
      status: "AVAILABLE",
      categoryId: catMonitores.id, createdById: adminUser.id,
    },
  });

  const createAssets = async (categoryId: number, prefix: string, name: string) => {
    await Promise.all(
      Array.from({ length: 10 }, (_, index) => {
        const assetNumber = index + 1;
        const code = `${prefix}-${String(assetNumber).padStart(3, "0")}`;

        return prisma.asset.upsert({
          where: { code },
          update: { status: "AVAILABLE" },
          create: {
            code,
            name: `${name} ${assetNumber}`,
            status: "AVAILABLE",
            categoryId,
            createdById: adminUser.id,
          },
        });
      }),
    );
  };

  await Promise.all([
    createAssets(catTeclados.id, "TEC", "Teclado y Mouse"),
    createAssets(catImpresoras.id, "IMP", "Impresora"),
    createAssets(catServidores.id, "SRV", "Servidor"),
    createAssets(catRedes.id, "RED", "Equipo de Red"),
    createAssets(catAccesorios.id, "ACC", "Accesorio de Computo"),
  ]);

  console.log("Seeding finalizado con éxito.");
}

main()
  .catch((e) => {
    console.error("Error durante el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
