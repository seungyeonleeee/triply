"use client";

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

export default function TripsEmpty() {
  const [title, setTitle] = useState("");
  const addTrip = useTripsStore((state) => state.addTrip);

  const onCreate = () => {
    if (!title.trim()) return;

    addTrip({
      id: crypto.randomUUID(),
      title,
      places: [], // ⭐ 장소 초기화
      createdAt: new Date().toISOString(),
    });

    setTitle("");
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground">
        아직 여행이 없어요.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button>여행 추가하기</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 여행 만들기</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="여행 이름"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button onClick={onCreate}>생성</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
