import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none disabled:bg-[#333333] disabled:text-[#808080] disabled:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-[var(--gradient-primary)] text-white hover:bg-[var(--gradient-primary-hover)] hover:shadow-[var(--shadow-button-hover)] shadow-[var(--shadow-button)]",
        gradient: "bg-[var(--gradient-primary)] text-white hover:bg-[var(--gradient-primary-hover)] hover:shadow-[var(--shadow-button-hover)] shadow-[var(--shadow-button)]",
        secondary: "bg-transparent border border-[var(--border-default)] text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)]",
        ghost: "bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-[var(--shadow-button)]",
      },
      size: {
        sm: "h-8 px-3 text-sm font-medium",
        default: "h-10 px-4 py-2 text-base font-medium",
        lg: "h-12 px-6 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "ghost",
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