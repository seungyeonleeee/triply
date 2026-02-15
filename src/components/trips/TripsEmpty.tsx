"use client";

import CreateTripWizard from "./CreateTripWizard";

export default function TripsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        아직 여행이 없어요.
      </p>

      <CreateTripWizard />
    </div>
  );
}
