interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const colors = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-zinc-200 text-zinc-900",
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${colors[variant]}`}
    >
      {children}
    </button>
  );
}
