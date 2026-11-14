import AssetForm from "@/src/components/AssetForm";
import { CategoryService } from "@/src/features/categories/services/category.service";
import { requirePermission } from "@/src/lib/authorization";
 
export default async function NewAssetPage() {
  await requirePermission("assets:create", "/assets/new");
 
  const categories = await CategoryService.getCategories();
 
  return (
    <main>
      <h1>Registrar activo</h1>
      <AssetForm categories={categories} />
    </main>
  );
}
