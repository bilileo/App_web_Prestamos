export function Navbar({ action }: { action?: React.ReactNode }) {
  return (
    <header
      className="h-14 flex items-center justify-between px-6
        bg-slate-900 text-white"
    >
      <span className="font-semibold">Gestión de Activos</span>
      {action}
    </header>
  );
}
