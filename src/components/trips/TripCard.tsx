// src/components/trips/TripCard.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";

interface TripCardProps {
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  thumbnail?: string;
  description?: string;
}

export default function TripCard({ title, startDate, endDate, location, thumbnail, description }: TripCardProps) {
  return (
    <Card className="w-full p-0 pb-6 hover:shadow-lg transition-shadow cursor-pointer">
      {thumbnail && <img src={thumbnail} alt={title} className="w-full h-40 object-cover rounded-t-lg" />}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-500">{location}</p>
        <p className="text-xs text-gray-400">{startDate} ~ {endDate}</p>
      </CardHeader>
      <CardContent>
        {description && <p className=" text-gray-600 text-sm">{description}</p>}
      </CardContent>
      <CardFooter>
        <Button className="px-3 py-1 bg-primary text-white rounded-md text-sm">
          보기
        </Button>
      </CardFooter>
    </Card>
  );
}
