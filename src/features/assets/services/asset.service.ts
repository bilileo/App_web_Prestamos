import { prisma } from "../../../lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import type { AssetStatus } from "../constants";
 
export interface AssetQueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: AssetStatus;
  categoryId?: number;
}
 
export interface CreateAssetData {
  code: string;
  name: string;
  description?: string;
  serialNumber?: string;
  status?: AssetStatus;
  categoryId: number;
  createdById: number;
}
 
export interface UpdateAssetData {
  code?: string;
  name?: string;
  description?: string;
  serialNumber?: string;
  status?: AssetStatus;
  categoryId?: number;
}
 
function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
 
export class AssetService {
  static async getAssets(options: AssetQueryOptions = {}) {
    const page = Math.max(1, options.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 10));
    const search = options.search?.trim();
 
    const where: Prisma.AssetWhereInput = {};
 
    if (options.status) {
      where.status = options.status;
    }
 
    if (options.categoryId) {
      where.categoryId = options.categoryId;
    }
 
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { code: { contains: search, mode: "insensitive" } },
        { serialNumber: { contains: search, mode: "insensitive" } },
      ];
    }
 
    const total = await prisma.asset.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
 
    const items = await prisma.asset.findMany({
      where,
      skip: (safePage - 1) * pageSize,
      take: pageSize,
      include: {
        category: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
 
    return {
      items,
      meta: {
        total,
        page: safePage,
        pageSize,
        totalPages,
      },
    };
  }
 
  static async getAssetById(id: number) {
    return prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
 
  static async createAsset(data: CreateAssetData) {
    const existingCode = await prisma.asset.findUnique({
      where: { code: data.code },
    });
 
    if (existingCode) {
      throw new Error(`El código '${data.code}' ya está registrado.`);
    }
 
    if (data.serialNumber) {
      const existingSerial = await prisma.asset.findUnique({
        where: { serialNumber: data.serialNumber },
      });
 
      if (existingSerial) {
        throw new Error(
          `El número de serie '${data.serialNumber}' ya está registrado.`,
        );
      }
    }
 
    try {
      return await prisma.asset.create({
        data: {
          code: data.code,
          name: data.name,
          description: data.description || null,
          serialNumber: data.serialNumber || null,
          status: data.status ?? "AVAILABLE",
          categoryId: data.categoryId,
          createdById: data.createdById,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error("El código o número de serie ya está registrado.");
      }
 
      throw error;
    }
  }
 
  static async updateAsset(id: number, data: UpdateAssetData) {
    const current = await prisma.asset.findUnique({ where: { id } });
 
    if (!current) {
      throw new Error("El activo no existe.");
    }
 
    if (data.code && data.code !== current.code) {
      const existingCode = await prisma.asset.findUnique({
        where: { code: data.code },
      });
 
      if (existingCode) {
        throw new Error(`El código '${data.code}' ya está registrado.`);
      }
    }
 
    if (data.serialNumber && data.serialNumber !== current.serialNumber) {
      const existingSerial = await prisma.asset.findUnique({
        where: { serialNumber: data.serialNumber },
      });
 
      if (existingSerial) {
        throw new Error(
          `El número de serie '${data.serialNumber}' ya está registrado.`,
        );
      }
    }
 
    try {
      return await prisma.asset.update({
        where: { id },
        data: {
          code: data.code,
          name: data.name,
          description:
            data.description === undefined ? undefined : data.description || null,
          serialNumber:
            data.serialNumber === undefined ? undefined : data.serialNumber || null,
          status: data.status,
          categoryId: data.categoryId,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error("El código o número de serie ya está registrado.");
      }
 
      throw error;
    }
  }
 
  static async deleteAsset(id: number) {
    const asset = await prisma.asset.findUnique({ where: { id } });
 
    if (!asset) {
      throw new Error("El activo no existe.");
    }
 
    if (asset.status === "LOANED") {
      throw new Error("Imposible eliminar: el activo está prestado.");
    }
 
    return prisma.asset.delete({ where: { id } });
  }
}
