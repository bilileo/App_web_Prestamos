import CategoryForm from "@/src/components/CategoryForm";
import { requirePermission } from "@/src/lib/authorization";
 
export default async function NewCategoryPage() {
  await requirePermission("categories:create", "/categories/new");
 
  return (
    <main>
      <h1>Registrar categoría</h1>
      <CategoryForm />
    </main>
  );
}
