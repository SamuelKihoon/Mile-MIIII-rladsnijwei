import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-1.5 text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-gray-900",
        model:
          "bg-gray-100 text-gray-900 rounded-lg pl-3 pr-4 py-2 shadow-sm flex items-center overflow-hidden border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  iconBg?: string
  iconSrc?: string
}

function Badge({ className, variant, iconBg, iconSrc, ...props }: BadgeProps) {
  return (
    <>
      {variant === "model" && (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
          <div
            className="h-10 w-10 flex items-center justify-center rounded-md overflow-hidden"
            style={{ backgroundColor: iconBg || "#db8848" }}
          >
            {iconSrc && <img src={iconSrc || "/placeholder.svg"} alt="" className="w-7 h-7 object-contain" />}
          </div>
          <span className="px-3 py-1 text-lg font-medium">{props.children}</span>
        </div>
      )}
      {variant !== "model" && (
        <div className={cn(badgeVariants({ variant }), className)} {...props}>
          {props.children}
        </div>
      )}
    </>
  )
}

export { Badge, badgeVariants }
