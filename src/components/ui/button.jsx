import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold uppercase tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border-3 border-foreground outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-1 active:translate-y-1",
        destructive: "bg-destructive text-destructive-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]",
        outline: "bg-card text-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground shadow-neo hover:shadow-neo-sm hover:translate-x-[2px] hover:translate-y-[2px]",
        ghost: "border-0 shadow-none hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline border-0 shadow-none",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
