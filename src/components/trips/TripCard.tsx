// src/components/trips/TripCard.tsx
"use client";

import Link from "next/link";
import { Trip } from "@/types/trip";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const { id, title, startDate, endDate, places } = trip;

  return (
    <Card className="w-full py-6 hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <p className="text-sm text-muted-foreground">
          장소 {places.length}곳
        </p>

        {(startDate || endDate) && (
          <p className="text-xs text-muted-foreground">
            {startDate} {endDate && `~ ${endDate}`}
          </p>
        )}
      </CardHeader>

      <CardContent />

      <CardFooter>
        <Link href={`/trips/${id}`}>
          <Button size="sm">보기</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
