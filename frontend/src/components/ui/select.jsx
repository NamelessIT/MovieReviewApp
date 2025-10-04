import React, { Children, isValidElement } from "react";

/**
 * Native <select> mock cho API giống shadcn/ui:
 * <Select value onValueChange>
 *   <SelectTrigger className="w-16">
 *     <SelectValue placeholder="Select rows" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="5">5</SelectItem>
 *     ...
 *   </SelectContent>
 * </Select>
 */
export function Select({ value, onValueChange, children, className }) {
  let placeholder;
  const items = [];
  let triggerClass = "";

  // Duyệt cây con để gom dữ liệu cấu hình
  const scan = (nodes) => {
    Children.forEach(nodes, (child) => {
      if (!isValidElement(child)) return;

      if (child.type === SelectTrigger) {
        if (child.props?.className) triggerClass += ` ${child.props.className}`;
        if (child.props?.children) scan(child.props.children);
      } else if (child.type === SelectContent) {
        if (child.props?.children) scan(child.props.children);
      } else if (child.type === SelectValue) {
        if (child.props?.placeholder !== undefined) placeholder = child.props.placeholder;
      } else if (child.type === SelectItem) {
        items.push({
          value: child.props?.value ?? "",
          label: child.props?.children ?? "",
        });
      } else if (child.props?.children) {
        // fallback: nếu ai đó bọc thêm layer lạ
        scan(child.props.children);
      }
    });
  };

  scan(children);

  const mergedClass = `border rounded px-2 py-1 ${className || ""} ${triggerClass}`.trim();

  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={mergedClass}
    >
      {placeholder !== undefined && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {items.map((it) => (
        <option key={String(it.value)} value={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  );
}

// Các component “vệ tinh” chỉ phục vụ cấu hình, KHÔNG render DOM
export function SelectTrigger({ children, className }) {
  return null;
}

export function SelectValue({ placeholder }) {
  return null;
}

export function SelectContent({ children }) {
  return null;
}

export function SelectItem({ value, children }) {
  return null;
}
