import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

export type CategoryInput = {
  name: string;
};

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export class CategoryService {
  static async getCategories() {
    return prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  static async getCategoryById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  static async getCategoriesWithAssetCounts() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { assets: true },
        },
      },
    });
  }

  static async createCategory(data: CategoryInput) {
    try {
      return await prisma.category.create({ data });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error(`El nombre '${data.name}' ya está registrado.`);
      }

      throw error;
    }
  }

  static async updateCategory(id: number, data: CategoryInput) {
    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new Error("La categoría no existe.");
    }

    try {
      return await prisma.category.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error(`El nombre '${data.name}' ya está registrado.`);
      }

      throw error;
    }
  }

  static async deleteCategory(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new Error("La categoría no existe.");
    }

    const assetCount = await prisma.asset.count({
      where: { categoryId: id },
    });
    if (assetCount > 0) {
      throw new Error(
        "No se puede eliminar: la categoría tiene activos asociados.",
      );
    }

    return prisma.category.delete({ where: { id } });
  }
}