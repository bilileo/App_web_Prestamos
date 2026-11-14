import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("Iniciando pruebas de conteo con count y _count en Prisma...\n");

  // 1. Obtén el número total de activos disponibles en todo el sistema mediante count().
  const totalActivosDisponibles = await prisma.asset.count({
    where: {
      status: "AVAILABLE",
    },
  });
  console.log("1. Total de activos disponibles (status = AVAILABLE):", totalActivosDisponibles);

  console.log("\n--------------------------------------------------\n");









  
  // 2. Obtén la lista de todas las categorías incluyendo el conteo total de activos que tiene cada una utilizando _count.
  const categoriasConConteoActivos = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          assets: true,
        },
      },
    },
  });
  console.log("2. Lista de categorías con conteo de activos asociados (_count):");
  console.dir(categoriasConConteoActivos, { depth: null });
}

main()
  .catch((e) => {
    console.error("Error en la ejecución:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
