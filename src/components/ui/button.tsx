import * as React from "react";
import { cn } from "@/utils";

const buttonVariants = {
  variant: {
    default: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
    destructive: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
    outline: "border-2 border-blue-600 bg-transparent hover:bg-blue-50 hover:border-blue-700 text-blue-700 hover:text-blue-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 hover:text-gray-800 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200",
    ghost: "hover:bg-blue-50 hover:text-blue-700 text-gray-600 hover:shadow-md transition-all duration-200",
    link: "text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline transition-colors duration-200",
    success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
    warning: "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
    info: "bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200",
    premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300",
  },
  size: {
    default: "h-10 px-6 py-2 text-sm font-semibold",
    sm: "h-8 rounded-lg px-4 text-xs font-medium",
    lg: "h-12 rounded-xl px-10 text-base font-semibold",
    xl: "h-14 rounded-2xl px-12 text-lg font-bold",
    icon: "h-10 w-10 rounded-lg",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:transform-none active:scale-95",
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {!loading && icon && (
          <span className="mr-2 flex items-center">{icon}</span>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };