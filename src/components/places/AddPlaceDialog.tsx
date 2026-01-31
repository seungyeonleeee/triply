"use client";

import { useState } from "react";
import { useTripsStore } from "@/store/tripsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddPlaceDialogProps {
  tripId: string;
}

export default function AddPlaceDialog({ tripId }: AddPlaceDialogProps) {
  const [name, setName] = useState("");
  const addPlace = useTripsStore((state) => state.addPlace);

  const onAdd = () => {
    if (!name.trim()) return;

    addPlace(tripId, {
      id: crypto.randomUUID(),
      name,
    });

    setName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">장소 추가하기</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>장소 추가</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="장소 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={onAdd}>추가</Button>
      </DialogContent>
    </Dialog>
  );
}
