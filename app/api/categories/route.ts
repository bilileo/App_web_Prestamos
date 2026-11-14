import { NextResponse } from "next/server";
import { CategoryService } from "@/src/features/categories/services/category.service";
import { hasPermission } from "@/src/features/auth/permissions";
import { getCurrentUser } from "@/src/lib/session";
 
export async function GET() {
  const user = await getCurrentUser();
 
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
 
  if (!hasPermission(user.role, "categories:read")) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
 
  try {
    const categories = await CategoryService.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { error: "Error interno al recuperar categorías", details: message },
      { status: 500 },
    );
  }
}
 
export async function POST(request: Request) {
  const user = await getCurrentUser();
 
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
 
  if (!hasPermission(user.role, "categories:create")) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
 
  try {
    const body = await request.json();
    const newCategory = await CategoryService.createCategory(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al registrar categoría";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
