"use client";

import { useParams } from "next/navigation";
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

import PlaceCard from "@/components/places/PlaceCard";

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();

  const trip = useTripsStore((state) =>
    state.trips.find((t) => t.id === tripId)
  );
  const addPlace = useTripsStore((state) => state.addPlace);

  const [placeName, setPlaceName] = useState("");

  if (!trip) {
    return <div className="p-4 text-sm">여행을 찾을 수 없어요.</div>;
  }

  const onAddPlace = () => {
    if (!placeName.trim()) return;

    addPlace(trip.id, {
      id: crypto.randomUUID(),
      name: placeName,
    });

    setPlaceName("");
  };

  return (
    <div className="size-full p-4 space-y-6">
      {/* 여행 정보 */}
      <div>
        <h1 className="text-xl font-semibold">{trip.title}</h1>
        <p className="text-sm text-muted-foreground">
          장소 {trip.places.length}곳
        </p>
      </div>

      {/* 장소 추가 */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">장소 추가</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>장소 추가</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="장소 이름"
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
          />

          <Button onClick={onAddPlace}>추가</Button>
        </DialogContent>
      </Dialog>

      {/* 장소 리스트 */}
      <ul className="space-y-2">
        {trip.places.map((place) => (
          <li key={place.id}>
            <PlaceCard place={place} tripId={trip.id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
