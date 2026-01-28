"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreateTripDialog from "./CreateTripDialog";

export default function TripsEmpty() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg font-medium">아직 여행이 없어요 ✈️</p>
        <p className="mt-2 text-sm text-muted-foreground">
          첫 여행을 추가해보세요
        </p>
        <Button className="mt-6" onClick={() => setOpen(true)}>
          여행 추가하기
        </Button>
      </div>

      <CreateTripDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
