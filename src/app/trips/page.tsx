"use client";

import TripCard from "@/components/trips/TripCard";
import TripsEmpty from "@/components/trips/TripsEmpty";
import { useTripsStore } from "@/store/tripsStore";

export default function TripsPage() {
  const trips = useTripsStore((state) => state.trips);

  return (
    <div className={trips.length === 0 ? "size-full p-4 space-y-4" : "size-full min-h-[calc(100vh-57px)] p-4 space-y-4"}>
      {trips.length === 0 ? (
        <TripsEmpty />
      ) : (
        <>
          <h1 className="text-lg font-semibold">내 여행</h1>
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </>
      )}
    </div>
  );
}
