import React from "react";

export function Badge({ children, className, variant = "default" }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium";

  const styles = {
    default: "bg-gray-900 text-white border-transparent",
    secondary: "bg-gray-100 text-gray-800 border-gray-200",
    destructive: "bg-red-100 text-red-800 border-red-200",
    outline: "bg-transparent text-gray-900 border-gray-300",
  };

  return (
    <span className={`${base} ${styles[variant]} ${className || ""}`}>
      {children}
    </span>
  );
}

export default Badge