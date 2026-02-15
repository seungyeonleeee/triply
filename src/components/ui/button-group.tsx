"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type ButtonProps } from "@/components/ui/button"

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("inline-flex h-10 items-center justify-center rounded-md border border-gray-200", className)}
    {...props}
  />
))
ButtonGroup.displayName = "ButtonGroup"

interface ButtonGroupItemProps extends ButtonProps {
  children: React.ReactNode
}

const ButtonGroupItem = React.forwardRef<
  HTMLButtonElement,
  ButtonGroupItemProps
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant="ghost"
    size="sm"
    className={cn(
      "rounded-none px-3 h-full border-r border-gray-200 last:border-r-0",
      "hover:bg-accent hover:text-accent-foreground",
      "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  >
    {children}
  </Button>
))
ButtonGroupItem.displayName = "ButtonGroupItem"

export { ButtonGroup, ButtonGroupItem }
