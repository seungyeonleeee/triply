"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import TripCard from "@/components/trips/TripCard";
import TripsEmpty from "@/components/trips/TripsEmpty";
import CreateTripDialog from "@/components/trips/CreateTripDialog";
import { useTripsStore } from "@/store/tripsStore";
import { Button } from "@/components/ui/button";

export default function TripsPage() {
  const trips = useTripsStore((state) => state.trips);
  const fetchTrips = useTripsStore((state) => state.fetchTrips);

  useEffect(() => {
    fetchTrips();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchTrips();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [fetchTrips]);

  return (
    <div className={trips.length === 0 ? "size-full p-4 space-y-4" : "size-full min-h-[calc(100vh-58px)] p-4 space-y-4"}>
      {trips.length === 0 ? (
        <TripsEmpty />
      ) : (
        <>
          <div className="space-y-3">
            <h1 className="text-lg font-semibold">내 여행</h1>
            <CreateTripDialog variant="iconBox" />
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
