interface TripDetailPageProps {
  params: {
    tripId: string;
  };
}

export default function TripDetailPage({ params }: TripDetailPageProps) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">
        여행 상세: {params.tripId}
      </h1>
      <p className="mt-2 text-gray-600">
        날짜별 일정과 지도를 표시합니다.
      </p>
    </main>
  );
}
