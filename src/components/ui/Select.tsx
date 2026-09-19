import React, { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, fullWidth = true, options, className = "", ...props },
    ref,
  ) => {
    const width = fullWidth ? "w-full" : "";
    const errorStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "border-outline focus:ring-primary";

    return (
      <div className={`${width} flex flex-col gap-1.5`}>
        {label && (
          <label className="text-sm font-medium text-on-surface">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={`appearance-none bg-surface-container-low border rounded-lg pl-4 pr-10 py-2 w-full text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow cursor-pointer ${errorStyles} ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-on-surface-variant">
            <ChevronDown className="h-5 w-5" />
          </div>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Select.displayName = "Select";
