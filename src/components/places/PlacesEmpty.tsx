import AddPlaceDialog from "./AddPlaceDialog";

interface PlacesEmptyProps {
  tripId: string;
}

export default function PlacesEmpty({ tripId }: PlacesEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <p className="text-sm text-muted-foreground">
        아직 장소가 없어요.
      </p>

      <AddPlaceDialog tripId={tripId} />
    </div>
  );
}
