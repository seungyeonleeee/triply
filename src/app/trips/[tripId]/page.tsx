"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useTripsStore } from "@/store/tripsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PlaceCard from "@/components/places/PlaceCard";

export default function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();

  const trip = useTripsStore((state) =>
    state.trips.find((t) => t.id === tripId)
  );
  const addPlace = useTripsStore((state) => state.addPlace);

  const [placeName, setPlaceName] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (!trip) {
    return <div className="p-4 text-sm">여행을 찾을 수 없어요.</div>;
  }

  const onAddPlace = () => {
    if (!placeName.trim()) return;

    addPlace(trip.id, {
      id: crypto.randomUUID(),
      name: placeName,
    });

    setPlaceName("");
  };

  // 여행 제목 포맷 (첫 번째 장소 + "여행")
  const firstPlace = trip.places.length > 0 ? trip.places[0].name : "미정";
  const displayTitle = `${firstPlace} 여행`;

  // 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const displayDate = trip.startDate
    ? trip.endDate
      ? `${formatDate(trip.startDate)} ~ ${formatDate(trip.endDate)}`
      : `${formatDate(trip.startDate)}`
    : "미정";

  // Day별 일정 생성
  const generateDays = () => {
    if (!trip.startDate || !trip.endDate) return [];

    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push({
        day: days.length + 1,
        date: new Date(d),
        dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      });
    }

    return days;
  };

  const days = generateDays();

  return (
    <div className="size-full min-h-screen p-4 space-y-6 pb-20">
      {/* 여행 정보 헤더 */}
      <div className="space-y-3 border-b pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">{displayDate}</p>

            {/* 동행자 정보 */}
            {trip.companions && trip.companions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {trip.companions.map((companion, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                  >
                    {companion}
                  </span>
                ))}
              </div>
            )}

            {/* 여행 스타일 */}
            {trip.travelStyle && (
              <div className="mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {trip.travelStyle}
                </span>
              </div>
            )}
          </div>

          {/* 수정 버튼 */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => setIsEditingTitle(!isEditingTitle)}
          >
            ✏️
          </Button>
        </div>
      </div>

      {/* Day별 일정 */}
      <div className="space-y-6">
        {days.length > 0 ? (
          days.map((dayInfo) => (
            <div key={dayInfo.day} className="space-y-3">
              <h2 className="text-lg font-semibold">
                Day {dayInfo.day} {dayInfo.dateStr}
              </h2>

              {/* 이 날짜의 장소들 */}
              <div className="space-y-2 pl-4">
                {trip.places.map((place) => (
                  <PlaceCard key={place.id} place={place} tripId={trip.id} />
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 pl-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      + 장소 추가
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>장소 추가</DialogTitle>
                    </DialogHeader>

                    <Input
                      placeholder="장소 이름"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                    />

                    <Button onClick={onAddPlace}>추가</Button>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="outline">
                  + 메모 추가
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>여행 날짜를 선택하면 일정을 계획할 수 있어요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
