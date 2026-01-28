import TripCard from "@/components/trips/TripCard";
import { mockTrips } from "@/data/mockTrips";
import TripsEmptyProps from "@/components/trips/TripsEmpty";

export default function HomePage() {
  return (
    <div className="space-y-4 p-4">
      {mockTrips.length === 0 ? (
        <TripsEmptyProps onCreate={() => {}} />
      ) : (
        mockTrips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))
      )}
    </div>
  );
}
