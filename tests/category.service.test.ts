import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { CategoryService } from "../src/features/categories/services/category.service.js";
import { prisma } from "../src/lib/prisma.js";

test("CategoryService: crear, consultar, actualizar y eliminar categorías", async () => {
  const uniqueId = randomUUID();
  const categoryName = `Category service test ${uniqueId}`;
  const categoryIds: number[] = [];
  let userId: number | undefined;

  try {
    const category = await CategoryService.createCategory({
      name: categoryName,
    });
    categoryIds.push(category.id);
    assert.equal(category.name, categoryName);

    await assert.rejects(
      CategoryService.createCategory({ name: categoryName }),
      /ya está registrado/,
    );

    const otherCategory = await CategoryService.createCategory({
      name: `Other category ${uniqueId}`,
    });
    categoryIds.push(otherCategory.id);
    await assert.rejects(
      CategoryService.updateCategory(otherCategory.id, { name: categoryName }),
      /ya está registrado/,
    );

    const updatedCategory = await CategoryService.updateCategory(category.id, {
      name: `Updated ${categoryName}`,
    });
    assert.equal(updatedCategory.name, `Updated ${categoryName}`);

    const categories = await CategoryService.getCategories();
    assert.ok(categories.some(({ name }) => name === updatedCategory.name));

    const user = await prisma.user.create({
      data: {
        name: `Category service test ${uniqueId}`,
        email: `category-service-${uniqueId}@example.test`,
      },
    });
    userId = user.id;
    const asset = await prisma.asset.create({
      data: {
        code: `CATEGORY-TEST-${uniqueId}`,
        name: `Category service asset ${uniqueId}`,
        categoryId: category.id,
        createdById: user.id,
      },
    });
    await assert.rejects(
      CategoryService.deleteCategory(category.id),
      /la categoría tiene activos asociados/,
    );
    await prisma.asset.delete({ where: { id: asset.id } });
    await prisma.user.delete({ where: { id: user.id } });
    userId = undefined;

    await CategoryService.deleteCategory(category.id);
    categoryIds.splice(categoryIds.indexOf(category.id), 1);
    assert.equal(
      await prisma.category.findUnique({ where: { id: category.id } }),
      null,
    );

    await assert.rejects(
      CategoryService.deleteCategory(category.id),
      /La categoría no existe/,
    );
  } finally {
    if (categoryIds.length > 0) {
      await prisma.asset.deleteMany({
        where: { categoryId: { in: categoryIds } },
      });
      await prisma.category.deleteMany({
        where: { id: { in: categoryIds } },
      });
    }
    if (userId !== undefined) {
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  }
});
