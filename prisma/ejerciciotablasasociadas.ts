import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Iniciando pruebas de consultas con tablas asociadas en Prisma...\n");

  // 1. Obtén todos los activos e incluye la información completa de su categoría (category) y usuario creador (createdBy).
  const activosConRelaciones = await prisma.asset.findMany({
    include: {
      category: true,
      createdBy: true,
    },
  });
  console.log("1. Activos con su categoría y usuario creador:");
  console.dir(activosConRelaciones, { depth: null });

  console.log("\n--------------------------------------------------\n");

  // 2. Obtén todas las categorías e incluye la lista de todos sus activos asociados.
  const categoriasConActivos = await prisma.category.findMany({
    include: {
      assets: true,
    },
  });
  console.log("2. Categorías con sus activos asociados:");
  console.dir(categoriasConActivos, { depth: null });
}

main()
  .catch((e) => {
    console.error("Error en la ejecución:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
