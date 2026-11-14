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

 
//Fin findMany

  //findUnique
  const activoUnico = await prisma.asset.findUnique({
    where: {
      code: 'CPU-001', // Reemplaza con el ID del activo que deseas buscar
    },
  });
  console.log("Activo único encontrado:", activoUnico);

  const emailUnico = await prisma.user.findUnique({
    where: {
      email: 'admin@empresa.com',
    },
  });
  console.log("Usuario único encontrado:", emailUnico);

  const categoriaUnica = await prisma.category.findUnique({
    where: {
      name: 'Impresoras',
    },
  });
  console.log("Categoría única encontrada:", categoriaUnica);

  //Fin unique
  

  //WHERE

  const activosDisponiblesId1 = await prisma.asset.findMany({
    where: {
      status: "AVAILABLE",
      id: 1,
    },
  });
  console.log("Activos disponibles con ID 1:", activosDisponiblesId1);

  const activosAvailableOrMaintenance = await prisma.asset.findMany({
    where: {
      OR: [
        { status: "AVAILABLE" },
        { status: "MAINTENANCE" },
      ],
    },
  });
  console.log("Activos disponibles o en mantenimiento:", activosAvailableOrMaintenance);

  const activosExceptoRetired = await prisma.asset.findMany({
    where: {
      NOT: {
        status: "RETIRED",
      },
    },
  });
  console.log("Activos excepto los retirados:", activosExceptoRetired);

  //Fin WHERE
}


main()
  .catch((e) => {
    console.error("Error en la ejecución:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
