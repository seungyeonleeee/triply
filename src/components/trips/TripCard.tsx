import { Trip } from "@/types/trip";

interface Props {
  trip: Trip;
}

export default function TripCard({ trip }: Props) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{trip.title}</h3>

      <p className="mt-1 text-sm text-gray-500">
        {trip.city}
      </p>

      <p className="mt-2 text-xs text-gray-400">
        {trip.startDate} ~ {trip.endDate}
      </p>
    </div>
  );
}
