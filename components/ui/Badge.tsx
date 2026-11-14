interface BadgeProps {
  text: string;
  status?: "success" | "warning" | "danger";
}

export function Badge({ text, status = "success" }: BadgeProps) {
  const colors = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[status]}`}>
      {text}
    </span>
  );
}
