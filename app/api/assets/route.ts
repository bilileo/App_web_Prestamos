import { NextResponse } from "next/server";
import { AssetService } from "@/src/features/assets/services/asset.service";
import { assetSchema } from "@/src/features/assets/validations/assetSchema";
import { parseAssetFilters } from "@/src/features/assets/validations/assetFilters";
import { hasPermission } from "@/src/features/auth/permissions";
import { getCurrentUser } from "@/src/lib/session";
 
export async function GET(request: Request) {
  const user = await getCurrentUser();
 
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
 
  if (!hasPermission(user.role, "assets:read")) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
 
  try {
    const { searchParams } = new URL(request.url);
    const filters = parseAssetFilters(Object.fromEntries(searchParams));
 
    const result = await AssetService.getAssets({
      search: filters.search,
      status: filters.status,
      categoryId: filters.categoryId,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Error interno al recuperar activos" },
      { status: 500 },
    );
  }
}
 
export async function POST(request: Request) {
  const user = await getCurrentUser();
 
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
 
  if (!hasPermission(user.role, "assets:create")) {
    return NextResponse.json({ error: "Prohibido" }, { status: 403 });
  }
 
  try {
    const body = await request.json();
    const parsed = assetSchema.safeParse(body);
 
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", fields: parsed.error.flatten().fieldErrors },
        { status: 422 },
      );
    }
 
    const newAsset = await AssetService.createAsset({
      ...parsed.data,
      createdById: user.id,
    });
 
    return NextResponse.json(newAsset, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Error al registrar activo",
      },
      { status: 400 },
    );
  }
}
