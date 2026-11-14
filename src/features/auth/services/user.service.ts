import bcrypt from "bcryptjs";
import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";
import type { Role } from "../constants";

export type CreateUserData = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type UpdateUserData = {
  name: string;
  email: string;
  password?: string;
  role: Role;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

function isUniqueConstraintError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function normalizeRole(role: string): Role {
  return role === "ADMIN" ? "ADMIN" : "USER";
}

export class UserService {
  static async getUsers() {
    const users = await prisma.user.findMany({
      select: publicUserSelect,
      orderBy: { createdAt: "desc" },
    });

    return users.map((user) => ({
      ...user,
      role: normalizeRole(user.role),
    }));
  }

  static async getUserById(id: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });

    return user
      ? {
          ...user,
          role: normalizeRole(user.role),
        }
      : null;
  }

  static async createUser(data: CreateUserData) {
    try {
      const passwordHash = await bcrypt.hash(data.password, 12);

      return await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          passwordHash,
          role: data.role,
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error(`El correo '${data.email}' ya está registrado.`);
      }

      throw error;
    }
  }

  static async updateUser(id: number, data: UpdateUserData) {
    const current = await prisma.user.findUnique({ where: { id } });

    if (!current) {
      throw new Error("El usuario no existe.");
    }

    const passwordHash = data.password
      ? await bcrypt.hash(data.password, 12)
      : undefined;

    try {
      return await prisma.user.update({
        where: { id },
        data: {
          name: data.name,
          email: data.email,
          role: data.role,
          ...(passwordHash ? { passwordHash } : {}),
        },
        select: publicUserSelect,
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new Error(`El correo '${data.email}' ya está registrado.`);
      }

      throw error;
    }
  }

  static async deleteUser(id: number, requestingUserId: number) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      throw new Error("El usuario no existe.");
    }

    if (user.id === requestingUserId) {
      throw new Error("No puedes eliminar tu propio usuario.");
    }

    const assetCount = await prisma.asset.count({
      where: { createdById: id },
    });

    if (assetCount > 0) {
      throw new Error(
        "No se puede eliminar: el usuario tiene activos registrados.",
      );
    }

    if (user.role === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        throw new Error("No se puede eliminar al último administrador.");
      }
    }

    return prisma.user.delete({
      where: { id },
      select: publicUserSelect,
    });
  }
}
