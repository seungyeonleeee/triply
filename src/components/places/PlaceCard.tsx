"use client";

import { useState } from "react";
import { Place } from "@/types/trip";
import { useTripsStore } from "@/store/tripsStore";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PlaceCardProps {
  place: Place;
  tripId: string;
}

export default function PlaceCard({ place, tripId }: PlaceCardProps) {
  const updatePlace = useTripsStore((s) => s.updatePlace);
  const removePlace = useTripsStore((s) => s.removePlace);

  const [memo, setMemo] = useState(place.memo ?? "");

  const onSaveMemo = () => {
    updatePlace(tripId, place.id, { memo });
  };

  const onDelete = () => {
    removePlace(tripId, place.id);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{place.name}</p>

          <Button
            size="sm"
            variant="ghost"
            className="text-destructive"
            onClick={onDelete}
          >
            삭제
          </Button>
        </div>

        {place.memo && (
          <p className="text-xs text-muted-foreground">
            {place.memo}
          </p>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              메모
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>장소 메모</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="메모를 입력하세요"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />

            <Button onClick={onSaveMemo}>저장</Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
