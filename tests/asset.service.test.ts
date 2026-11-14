import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { AssetService } from "../src/features/assets/services/asset.service.js";
import { prisma } from "../src/lib/prisma.js";

test("AssetService: crear, consultar, actualizar y eliminar activos", async () => {
  // 1. Preparar datos de prueba aislados. El UUID evita choques con otros
  // registros o ejecuciones anteriores de esta prueba.
  const uniqueId = randomUUID();
  const user = await prisma.user.create({
    data: {
      name: `Asset service test ${uniqueId}`,
      email: `asset-service-${uniqueId}@example.test`,
    },
  });

  console.log(`[Preparación] Usuario creado: ${user.name} (${user.email})`);
  let categoryId: number | undefined;

  try {
    // Cada activo necesita una categoría y un usuario creador. Se guardan sus
    // identificadores para usarlos al crear los activos y al limpiar después.
    const category = await prisma.category.create({
      data: { name: `Asset service test ${uniqueId}` },
    });
    categoryId = category.id;

    console.log(`[Preparación] Categoría creada: ${category.name} (id=${category.id})`);

    // 2. Crear dos activos mediante el servicio. El primero debe comenzar con
    // estado AVAILABLE; ambos compartirán categoría para facilitar los filtros.
    const firstAsset = await AssetService.createAsset({
      code: `TEST-${uniqueId}-needle`,
      name: `Needle ${uniqueId}`,
      categoryId,
      createdById: user.id,
    });

    console.log(`[Crear] Primer activo creado: ${firstAsset.name} (código=${firstAsset.code}, estado=${firstAsset.status})`);

    console.log(`[Crear] Creando segundo activo con código TEST-${uniqueId}-other.`);
    const secondAsset = await AssetService.createAsset({
      code: `TEST-${uniqueId}-other`,
      name: `Workstation ${uniqueId}`,
      categoryId,
      createdById: user.id,
    });
    console.log(`[Resultado] Segundo activo creado: ${secondAsset.name} (código=${secondAsset.code}, id=${secondAsset.id}).`);

    // 3. Comprobar validaciones de creación: el estado inicial es AVAILABLE
    // y no se permite registrar dos activos con el mismo código.
    console.log(`[Validación] Comprobando el estado inicial; se espera AVAILABLE y se obtuvo ${firstAsset.status}.`);
    assert.equal(firstAsset.status, "AVAILABLE");
    console.log(`[Validación] Intentando crear otro activo con el código ya usado ${firstAsset.code}; se espera un error de duplicado.`);
    await assert.rejects(
      AssetService.createAsset({
        code: firstAsset.code,
        name: "Duplicate",
        categoryId,
        createdById: user.id,
      }),
      /ya está registrado/,
    );
    console.log("[Resultado] El duplicado fue rechazado con el error esperado.");

    // 4. Consultar por categoría. Como se crearon dos activos en ella, tanto
    // la lista como el total informado en la metadata deben ser 2.
    console.log(`[Consulta] Buscando activos de la categoría ${categoryId}; se esperan 2 resultados.`);
    const filtered = await AssetService.getAssets({ categoryId });
    console.log(`[Resultado] Consulta por categoría: total=${filtered.meta.total}, elementos=${filtered.items.length}, códigos=${filtered.items.map(({ code }) => code).join(", ")}.`);
    assert.equal(filtered.meta.total, 2);
    assert.equal(filtered.items.length, 2);

    // 5. Buscar por texto sin distinguir mayúsculas y minúsculas. "needle"
    // coincide con el nombre del primer activo y no con el segundo.
    console.log(`[Búsqueda] Buscando "needle ${uniqueId}" dentro de la categoría ${categoryId}; se espera únicamente el primer activo.`);
    const searchResults = await AssetService.getAssets({
      categoryId,
      search: `needle ${uniqueId}`,
    });
    console.log(`[Resultado] Búsqueda: ${searchResults.items.length} coincidencia(s), ids=${searchResults.items.map(({ id }) => id).join(", ")}.`);
    assert.deepEqual(searchResults.items.map(({ id }) => id), [firstAsset.id]);

    // 6. Probar paginación: una página de tamaño 1 devuelve un elemento y
    // el total de dos resultados se representa en dos páginas.
    console.log(`[Paginación] Solicitando página 1 con tamaño 1 para la categoría ${categoryId}.`);
    const firstPage = await AssetService.getAssets({
      categoryId,
      page: 1,
      pageSize: 1,
    });
    console.log(`[Resultado] Página: elementos=${firstPage.items.length}, página=${firstPage.meta.page}, tamaño=${firstPage.meta.pageSize}, páginas totales=${firstPage.meta.totalPages}.`);
    assert.equal(firstPage.items.length, 1);
    assert.equal(firstPage.meta.totalPages, 2);

    // 7. Actualizar nombre y estado, y verificar que el servicio devuelve
    // los nuevos valores guardados.
    console.log(`[Actualización] Cambiando nombre y estado del activo id=${firstAsset.id}; estado solicitado: MAINTENANCE.`);
    const updatedAsset = await AssetService.updateAsset(firstAsset.id, {
      name: `Updated ${uniqueId}`,
      status: "MAINTENANCE",
    });
    console.log(`[Resultado] Activo actualizado: nombre=${updatedAsset.name}, estado=${updatedAsset.status}.`);
    assert.equal(updatedAsset.name, `Updated ${uniqueId}`);
    assert.equal(updatedAsset.status, "MAINTENANCE");

    // También se filtra por estado para comprobar que la actualización afecta
    // las consultas: solo el primer activo debe estar en mantenimiento.
    console.log(`[Consulta] Filtrando la categoría ${categoryId} por estado MAINTENANCE; se espera el id=${firstAsset.id}.`);
    const statusResults = await AssetService.getAssets({
      categoryId,
      status: "MAINTENANCE",
    });
    console.log(`[Resultado] Filtro por estado: ids=${statusResults.items.map(({ id }) => id).join(", ")}.`);
    assert.deepEqual(statusResults.items.map(({ id }) => id), [firstAsset.id]);

    // 8. Probar la regla de eliminación protegida: un activo prestado no se
    // puede eliminar. Se restaura a AVAILABLE para poder borrarlo enseguida.
    console.log(`[Eliminación protegida] Cambiando el activo id=${firstAsset.id} a LOANED y solicitando su eliminación; se espera un rechazo.`);
    await AssetService.updateAsset(firstAsset.id, { status: "LOANED" });
    await assert.rejects(
      AssetService.deleteAsset(firstAsset.id),
      /el activo está prestado/,
    );
    console.log("[Resultado] El activo prestado no se eliminó; se recibió el error esperado.");
    console.log(`[Preparación] Restaurando el activo id=${firstAsset.id} al estado AVAILABLE para probar la eliminación normal.`);
    await AssetService.updateAsset(firstAsset.id, { status: "AVAILABLE" });

    // 9. Confirmar la eliminación normal consultando directamente la base de
    // datos: el activo ya no debe existir. El segundo se borra para dejar
    // preparado el caso final, que intenta eliminar un identificador inexistente.
    console.log(`[Eliminación] Borrando el activo id=${firstAsset.id}, cuyo estado es AVAILABLE.`);
    await AssetService.deleteAsset(firstAsset.id);
    const deletedAsset = await prisma.asset.findUnique({
      where: { id: firstAsset.id },
    });
    console.log(`[Resultado] Búsqueda directa después de borrar: ${deletedAsset === null ? "el activo ya no existe" : "el activo todavía existe"}.`);
    assert.equal(deletedAsset, null);

    console.log(`[Limpieza] Borrando el segundo activo de prueba, id=${secondAsset.id}.`);
    await AssetService.deleteAsset(secondAsset.id);
    console.log("[Resultado] Segundo activo eliminado.");

    console.log(`[Validación] Intentando borrar de nuevo el activo id=${firstAsset.id}; se espera el error de activo inexistente.`);
    await assert.rejects(
      AssetService.deleteAsset(firstAsset.id),
      /El activo no existe/,
    );
    console.log("[Resultado] El servicio rechazó la eliminación del activo inexistente como se esperaba.");
  } finally {
    // 10. Limpiar los datos incluso si alguna aserción falla, para que la
    // prueba pueda volver a ejecutarse sin dejar registros de prueba.
    if (categoryId !== undefined) {
      console.log(`[Limpieza final] Eliminando activos restantes y categoría id=${categoryId}.`);
      await prisma.asset.deleteMany({ where: { categoryId } });
      await prisma.category.delete({ where: { id: categoryId } });
    }
    console.log(`[Limpieza final] Eliminando usuario de prueba id=${user.id} y cerrando conexión de Prisma.`);
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.$disconnect();
    console.log("[Limpieza final] Limpieza completada y conexión cerrada.");
  }
});
