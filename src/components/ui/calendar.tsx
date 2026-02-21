"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("w-full p-3", className)}
      classNames={{
        months: "relative flex gap-4 md:flex-row md:items-start",
        month: "flex-1 space-y-4",
        month_caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute left-1 top-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline", size: "icon-sm" }),
          "absolute right-1 top-1 size-7 bg-transparent p-0 opacity-70 hover:opacity-100"
        ),
        weekdays: "flex",
        weekday:
          "text-muted-foreground flex-1 rounded-md text-center text-[0.8rem] font-normal",
        week: "mt-2 flex w-full",
        day: "flex-1 text-center text-sm p-0",
        day_button: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "bg-accent text-accent-foreground",
        outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-50",
        range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        range_start: "rounded-l-md",
        range_end: "rounded-r-md",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className="size-4" {...iconProps} />
          ) : (
            <ChevronRight className="size-4" {...iconProps} />
          ),
      }}
      {...props}
    />
  )
}

export { Calendar }
