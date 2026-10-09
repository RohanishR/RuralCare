import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = true, className = "", ...props }, ref) => {
    const generatedId = React.useId();
    const id = props.id || generatedId;
    const width = fullWidth ? "w-full" : "";
    const errorStyles = error
      ? "border-red-500 focus:ring-red-500"
      : "border-outline focus:ring-primary";

    return (
      <div className={`${width} flex flex-col gap-1.5`}>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-on-surface">{label}</label>
        )}
        <input
          ref={ref}
          className={`bg-surface-container-low border rounded-lg px-4 py-2 text-on-surface focus:outline-none focus:ring-2 focus:ring-offset-1 transition-shadow ${errorStyles} ${className}`}
          {...props}
          id={id}
          aria-invalid={error ? true : props["aria-invalid"]}
          aria-describedby={[props["aria-describedby"], error ? `${id}-error` : ""].filter(Boolean).join(" ") || undefined}
        />
        {error && <span id={`${id}-error`} role="alert" className="text-xs text-red-500">{error}</span>}
      </div>
    );
  },
);

Input.displayName = "Input";
