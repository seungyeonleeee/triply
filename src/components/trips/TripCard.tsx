// src/components/trips/TripCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { useTripsStore } from "@/store/tripsStore";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const { id, title, startDate, endDate, places } = trip;
  const removeTrip = useTripsStore((state) => state.removeTrip);

  const handleDelete = () => {
    removeTrip(id);
  };

  const formattedTitle = `${title} 여행`;

  // 날짜 포맷
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const displayDate = startDate
    ? endDate
      ? `${formatDate(startDate)} ~ ${formatDate(endDate)}`
      : `${formatDate(startDate)}`
    : "미정";

  return (
    <div className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all bg-white">
      <Link href={`/trips/${id}`} className="block">
        <div className="flex h-24">
          {/* 이미지 섹션 */}
          <div className="w-1/4 h-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white">
          </div>

          {/* 콘텐츠 섹션 */}
          <div className="flex-1 p-4 flex flex-col justify-center relative">
            <div>
              <h3 className="font-semibold text-base truncate">{formattedTitle}</h3>
              <p className="text-xs text-muted-foreground mt-1">{displayDate}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {places.length}개 장소
              </p>
            </div>
          </div>
        </div>
      </Link>

      {/* 더보기 메뉴 */}
      <div
        className="absolute top-1 right-3"
        onClick={(e) => e.preventDefault()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              className="p-2 border-0 text-2xl text-gray-400 hover:text-gray-600"
            >
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-0 min-w-none">
            <ButtonGroup className="rounded-md border-0 bg-white">
              <Link href={`/trips/${id}`} onClick={(e) => e.stopPropagation()} className="w-full h-full">
                <ButtonGroupItem>수정</ButtonGroupItem>
              </Link>
              <ButtonGroupItem onClick={handleDelete} className="text-red-600 hover:text-red-600 border-l">
                삭제
              </ButtonGroupItem>
            </ButtonGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
