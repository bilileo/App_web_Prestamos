export default function Loading() {
  return (
    <main className="space-y-5 p-6">
      <div className="h-10 w-80 animate-pulse rounded bg-gray-200" />
      <div className="h-24 animate-pulse rounded-xl bg-gray-100" />
      <div className="h-72 animate-pulse rounded-xl bg-gray-100" />
      <p className="sr-only">Cargando activos...</p>
    </main>
  );
}
