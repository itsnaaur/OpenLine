import { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "elevated" | "outlined";
  hover?: boolean;
}

export default function Card({
  children,
  variant = "default",
  hover = false,
  className = "",
  ...props
}: CardProps) {
  const baseClasses = "bg-white rounded-xl";
  
  const variantClasses = {
    default: "shadow-md",
    elevated: "shadow-xl",
    outlined: "border-2 border-gray-200",
  };
  
  const hoverClasses = hover ? "transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" : "";

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

