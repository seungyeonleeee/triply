"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTripsStore } from "@/store/tripsStore"

type Props = {
  tripId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChecklistDialog({ tripId, open, onOpenChange }: Props) {
  const trip = useTripsStore((s) => s.trips.find((t) => t.id === tripId))
  const addItem = useTripsStore((s) => s.addChecklistItem)
  const toggleItem = useTripsStore((s) => s.toggleChecklistItem)
  const removeItem = useTripsStore((s) => s.removeChecklistItem)

  const items = trip?.checklist ?? []

  const [label, setLabel] = React.useState("")

  const handleAdd = () => {
    if (!label.trim()) return
    addItem(tripId, {
      id: crypto.randomUUID(),
      label,
      checked: false,
    })
    setLabel("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>체크리스트</DialogTitle>
          <DialogDescription>여행 준비물을 잊지 않도록 추가해보세요!</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b-2 border-dashed py-2 mb-0">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(tripId, item.id)}
                />
                <span
                  className={                   
                    item.checked ? "text-sm line-through text-muted-foreground" : "text-sm"
                  }
                >
                  {item.label}
                </span>
              </div>

              <Button
                variant="ghost"
                size="xs"
                onClick={() => removeItem(tripId, item.id)}
                className="border text-xs"
              >
                삭제
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 pt-4">
          <Input
            placeholder="아이템 추가"
            value={label}
            className="h-8"
            onChange={(e) => setLabel(e.target.value)}
          />
          <Button onClick={handleAdd} size="sm">추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}