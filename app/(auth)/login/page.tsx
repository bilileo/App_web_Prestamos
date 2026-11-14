import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { getCurrentUser } from "@/src/lib/session";
 
function safeCallbackUrl(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
 
  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/dashboard";
  }
 
  return candidate;
}
 
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string | string[] }>;
}) {
  const user = await getCurrentUser();
 
  if (user) {
    redirect("/dashboard");
  }
 
  const { callbackUrl } = await searchParams;
 
  return <LoginForm callbackUrl={safeCallbackUrl(callbackUrl)} />;
}
