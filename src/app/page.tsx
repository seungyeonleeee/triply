import TripCard from "@/components/trips/TripCard";
import { Trip } from "@/types/trip";
import EmptyState from "@/components/trips/EmptyState";

const mockTrips: Trip[] = [
  {
    id: "1",
    title: "도쿄 여행",
    city: "Tokyo",
    startDate: "2025-03-01",
    endDate: "2025-03-05",
  },
  {
    id: "2",
    title: "제주 힐링",
    city: "Jeju",
    startDate: "2025-04-10",
    endDate: "2025-04-13",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-4 p-4">
      {mockTrips.length === 0 ? (
        <EmptyState />
      ) : (
        mockTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))
      )}
    </div>
  );
}
