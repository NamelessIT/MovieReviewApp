export function Badge({ children, className = "" }) {
  return (
    <span
      className={`inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 ${className}`}
    >
      {children}
    </span>
  );
}
