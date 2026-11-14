import { prisma } from "../src/lib/prisma.js";
import { ModelName } from '../src/generated/prisma/internal/prismaNamespace';

async function main() {
  console.log("Iniciando pruebas de consultas con Prisma...");
  // Aquí se escribirán las soluciones de los niveles

  const activos = await prisma.asset.findMany();
  console.log("Activos encontrados:", activos);

  const categorias = await prisma.category.findMany();
  console.log("Categorías encontradas:", categorias);

  const activosDisponibles = await prisma.asset.findMany({
    where: {
      status: "AVAILABLE",
    },
  });
  console.log("Activos disponibles:", activosDisponibles);

 

}


main()
  .catch((e) => {
    console.error("Error en la ejecución:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
