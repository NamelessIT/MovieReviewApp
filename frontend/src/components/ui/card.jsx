export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-md ${className}`}
    >
      {children}
    </div>
  );
}
