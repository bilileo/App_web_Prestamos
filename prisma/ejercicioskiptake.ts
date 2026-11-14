import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Iniciando pruebas de paginación con skip y take en Prisma...\n");

  const pageSize = 5;

  // 1. Obtén los primeros 5 activos ordenados por ID de forma ascendente (Página 1).
  const page1 = 1;
  const activosPagina1 = await prisma.asset.findMany({
    take: pageSize,
    skip: (page1 - 1) * pageSize, // skip: 0
    orderBy: {
      id: "asc",
    },
  });
  console.log("1. Primeros 5 activos (Página 1, ordenados por ID asc):");
  console.dir(activosPagina1, { depth: null });

  console.log("\n--------------------------------------------------\n");

  // 2. Calcula la fórmula de desplazamiento para obtener los siguientes 5 activos (Página 2, omitiendo los primeros 5).
  // Fórmula: skip = (page - 1) * pageSize
  const page2 = 2;
  const skipFormula = (page2 - 1) * pageSize; // (2 - 1) * 5 = 5

  const activosPagina2 = await prisma.asset.findMany({
    take: pageSize,
    skip: skipFormula,
    orderBy: {
      id: "asc",
    },
  });
  console.log(`2. Siguientes 5 activos (Página 2, fórmula skip = (${page2} - 1) * ${pageSize} = ${skipFormula}):`);
  console.dir(activosPagina2, { depth: null });
}

main()
  .catch((e) => {
    console.error("Error en la ejecución:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
