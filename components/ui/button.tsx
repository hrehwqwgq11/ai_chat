import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[var(--brand-primary)] text-white hover:bg-gray-800 shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] hover:-translate-y-0.5",
        gradient: "bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 text-white hover:from-purple-600 hover:via-pink-600 hover:to-amber-600 shadow-[var(--shadow-feature)] hover:-translate-y-0.5",
        secondary: "bg-white text-[var(--brand-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-section)] hover:border-[var(--border-light)]",
        ghost: "hover:bg-[var(--bg-section)] hover:text-[var(--text-primary)]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }