"use client";

import TripCard from "@/components/trips/TripCard";
import TripsEmpty from "@/components/trips/TripsEmpty";
import CreateTripDialog from "@/components/trips/CreateTripDialog";
import { useTripsStore } from "@/store/tripsStore";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  const trips = useTripsStore((state) => state.trips);

  return (
    <div className={trips.length === 0 ? "size-full p-4 space-y-4" : "size-full min-h-[calc(100vh-57px)] p-4 space-y-4"}>
      {trips.length === 0 ? (
        <TripsEmpty />
      ) : (
        <>
          <div className="space-y-3">
            <h1 className="text-lg font-semibold">내 여행</h1>
            <div className="flex items-center gap-3 p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <CreateTripDialog variant="icon" />
              <div className="flex-1">
                <p className="font-medium text-sm">여행 일정 만들기</p>
                <p className="text-xs text-muted-foreground">새로운 여행을 떠나보세요.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
