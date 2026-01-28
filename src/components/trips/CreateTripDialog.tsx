"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateTripDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateTripDialog({
  open,
  onClose,
}: CreateTripDialogProps) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    console.log({
      title,
      location,
    });

    // 다음 STEP에서 Supabase insert로 교체
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>여행 만들기</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="여행 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="여행 지역 (예: 제주도)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSubmit}>생성</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
