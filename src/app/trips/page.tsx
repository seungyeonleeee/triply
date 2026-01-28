import TripCard from "@/components/trips/TripCard";
import TripsEmpty from "@/components/trips/TripsEmpty";
import { mockTrips } from "@/data/mockTrips";

export default function TripsPage() {
  // const trips = mockTrips; // 나중에 Supabase 데이터로 교체
  const trips: any[] = [];

  if (trips.length === 0) {
      return <TripsEmpty />;
  }

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2">
      {trips.map((trip) => (
        <TripCard key={trip.id} {...trip} />
      ))}
    </div>
  );
}
