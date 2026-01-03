import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-[#116aae] to-[#0da2cb] text-white hover:from-[#224092] hover:to-[#0d87bc] shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-[#0d87bc] to-[#0dc7e4] text-white hover:from-[#116aae] hover:to-[#0da2cb] shadow-lg hover:shadow-xl",
    outline: "border-2 border-[#116aae] text-[#116aae] hover:bg-[#116aae] hover:text-white",
    ghost: "text-[#116aae] hover:bg-[#e6f4f8]",
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

