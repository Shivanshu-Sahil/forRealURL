import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full border-3 border-foreground bg-input px-4 py-2 text-base font-medium text-foreground shadow-neo placeholder:text-muted-foreground focus:outline-none focus:shadow-neo-lg focus:-translate-x-[2px] focus:-translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-50 transition-all md:text-sm",
        className
      )}
      {...props} />
  );
}

export { Input }
