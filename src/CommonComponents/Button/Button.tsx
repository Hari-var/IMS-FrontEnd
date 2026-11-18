import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "text" | "outlined" | "contained";
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning" | "inherit";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disableElevation?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>;
  onFocus?: React.FocusEventHandler<HTMLButtonElement>;
  onBlur?: React.FocusEventHandler<HTMLButtonElement>;
  id?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  startIcon,
  endIcon,
  disableElevation = false,
  disabled = false,
  ariaLabel,
  children,
  className = "",
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  id,
  ...rest
}) => {
  // Map color to Tailwind classes
  const colorMap: Record<string, string> = {
    primary: "bg-blue-600 hover:bg-blue-700",
    secondary: "bg-pink-600 hover:bg-pink-700",
    success: "bg-green-600 hover:bg-green-700",
    error: "bg-red-600 hover:bg-red-700",
    info: "bg-cyan-600 hover:bg-cyan-700",
    warning: "bg-amber-600 hover:bg-amber-700",
    inherit: "bg-inherit hover:bg-inherit",
  };

  const outlinedColorMap: Record<string, string> = {
    primary: "border-blue-600 text-blue-600 hover:bg-blue-50",
    secondary: "border-pink-600 text-pink-600 hover:bg-pink-50",
    success: "border-green-600 text-green-600 hover:bg-green-50",
    error: "border-red-600 text-red-600 hover:bg-red-50",
    info: "border-cyan-600 text-cyan-600 hover:bg-cyan-50",
    warning: "border-amber-600 text-amber-600 hover:bg-amber-50",
    inherit: "border-inherit text-inherit hover:bg-inherit",
  };

  const textColorMap: Record<string, string> = {
    primary: "text-blue-600 hover:bg-blue-50",
    secondary: "text-pink-600 hover:bg-pink-50",
    success: "text-green-600 hover:bg-green-50",
    error: "text-red-600 hover:bg-red-50",
    info: "text-cyan-600 hover:bg-cyan-50",
    warning: "text-amber-600 hover:bg-amber-50",
    inherit: "text-inherit hover:bg-inherit",
  };

  // Map variant and color to Tailwind classes
  let variantClass = "";
  if (variant === "contained") {
    variantClass = `${colorMap[color] || colorMap.primary} text-white`;
  } else if (variant === "outlined") {
    variantClass = `bg-transparent border ${outlinedColorMap[color] || outlinedColorMap.primary}`;
  } else {
    variantClass = `bg-transparent ${textColorMap[color] || textColorMap.primary}`;
  }

  let sizeClass = "";
  if (size === "small") {
    sizeClass = "px-sm py-sm text-sm min-h-sm";
  } else if (size === "large") {
    sizeClass = "px-lg py-lg text-lg min-h-lg";
  } else {
    sizeClass = "px-md py-md text-base min-h-md";
  }

  let base = "inline-flex items-center justify-center font-medium rounded transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";
  if (!disableElevation && variant === "contained" && !disabled) {
    base += " shadow-md hover:shadow-lg";
  }
  if (fullWidth) base += " w-full";

  return (
    <button
      type="button"
      id={id}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${base} ${variantClass} ${sizeClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      {...rest}
    >
      {startIcon && <span className="mr-2 -ml-1 flex items-center">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="ml-2 -mr-1 flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
