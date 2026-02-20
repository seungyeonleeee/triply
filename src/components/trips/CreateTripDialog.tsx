"use client";

import { useState, useEffect } from "react";
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
import { TravelStyle } from "@/types/trip";

type Step = "places" | "companions" | "style" | "dates";

interface CreateTripWizardProps {
  variant?: "button" | "icon";
}

export default function CreateTripDialog({ variant = "button" }: CreateTripWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("places");
  const [title, setTitle] = useState("");
  const [companions, setCompanions] = useState<string>("");
  const [currentCompanion, setCurrentCompanion] = useState("");
  const [companionType, setCompanionType] = useState<string>("");
  const [showCompanionInput, setShowCompanionInput] = useState(false);
  const [styles, setStyles] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addTrip = useTripsStore((state) => state.addTrip);

  const companionOptions = ["혼자", "친구와", "가족과", "연인과", "배우자와", "아이와", "부모님과"];
  
  const travelStyles = [
    "체험·액티비티",
    "SNS 핫플레이스",
    "자연과 함께",
    "유명 관광지 필수",
    "여유롭게 힐링",
    "문화·예술·역사",
    "쇼핑은 열정적으로",
    "관광보다 먹방",
  ];

  const handleNext = () => {
    if (step === "places") {
      setStep("companions");
    } else if (step === "companions") {
      setStep("style");
    } else if (step === "style") {
      setStep("dates");
    }
  };

  const handlePrev = () => {
    switch (step) {
      case "companions":
        setStep("places");
        break;
      case "style":
        setStep("companions");
        break;
      case "dates":
        setStep("style");
        break;
    }
  };


  const handleCompanionTypeSelect = (type: string) => {
    if (type === "기타") {
      setCompanionType(type);
      setShowCompanionInput(true);
      setCompanions("");
      setCurrentCompanion("");
    } else {
      setCompanionType(type);
      setShowCompanionInput(false);
      setCompanions(type);
      setCurrentCompanion("");
    }
  };

  const handleAddCustomCompanion = () => {
    if (currentCompanion.trim()) {
      setCompanions(currentCompanion.trim());
      setCurrentCompanion("");
    }
  };

  const handleCreate = () => {
    if (title.trim() === "") {
      setTitle("");
    }

    addTrip({
      id: crypto.randomUUID(),
      title: title.trim() || "제목 없음",
      places: [],
      companions: companionType === "혼자" ? undefined : companions,
      travelStyles: styles.length > 0 ? (styles as TravelStyle[]) : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      createdAt: new Date().toISOString(),
    });

    // 초기화 및 닫기
    setTitle("");
    setCompanions("");
    setCurrentCompanion("");
    setCompanionType("");
    setShowCompanionInput(false);
    setStyles([]);
    setStartDate("");
    setEndDate("");
    setStep("places");
    setOpen(false);
  };
  (useTripsStore.getState().trips);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button size="lg" className="rounded-full w-12 h-12 pb-1 flex items-center justify-center text-2xl">
            +
          </Button>
        ) : (
          <Button>여행 추가하기</Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-left">
            {step === "places" && "어디로 떠나시나요?"}
            {step === "companions" && "누구랑 떠나시나요?"}
            {step === "style" && "어떤 스타일이 좋으세요?"}
            {step === "dates" && "언제 떠나세요?"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Step 1: 장소 */}
          {step === "places" && (
            <div className="space-y-3">
              <label htmlFor="place-input" className="text-sm font-medium mb-4 block">
                방문할 나라 또는 지역을 입력해주세요. <span className="text-blue-500">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  id="place-input"
                  placeholder="장소 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setStep("companions");
                    }
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 3: 동행자 */}
          {step === "companions" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">동행자 선택</label>
              <div className="flex flex-wrap gap-2">
                {[...companionOptions, "기타"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCompanionTypeSelect(option)}
                    className={`px-5 py-2 rounded-full border-2 font-medium transition-colors ${
                      companionType === option
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {companionType === "기타" && (
                <div className="space-y-2 mt-4 pt-4 border-t">
                  <label htmlFor="companion-custom-input" className="text-sm font-medium hidden"></label>
                  <div className="flex gap-2">
                    <Input
                      id="companion-custom-input"
                      placeholder="누구랑 떠나시나요?"
                      value={currentCompanion}
                      onChange={(e) => setCurrentCompanion(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddCustomCompanion();
                      }}
                    />
                    <Button
                      onClick={handleAddCustomCompanion}
                      variant="outline"
                      size="sm"
                      className="h-9"
                    >
                      추가
                    </Button>
                  </div>
                  {companions && (
                    <div className="bg-secondary p-2 rounded">
                      <span className="text-sm">{companions}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 2: 여행 스타일 */}
          {step === "style" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">여행 스타일 선택</label>
              <div className="grid grid-cols-2 gap-2">
                {travelStyles.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (styles.includes(s)) {
                        setStyles(styles.filter((style) => style !== s));
                      } else {
                        setStyles([...styles, s]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full border-2 font-medium transition-colors text-sm ${
                      styles.includes(s)
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 날짜 */}
          {step === "dates" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">
                여행 날짜 <span className="text-blue-500">*</span>
              </label>
              <div className="space-y-2">
                <div>
                  <label htmlFor="start-date" className="text-xs text-muted-foreground mb-2 block">
                    시작 날짜
                  </label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="end-date" className="text-xs text-muted-foreground mb-2 block">
                    종료 날짜
                  </label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 진행률 표시 */}
          <div className="flex gap-0 mt-6 rounded-full overflow-hidden h-1 bg-gray-200">
            <div
              className={`flex-1 ${
                ["places", "companions", "style", "dates"].indexOf(step) >= 0
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 ${
                ["companions", "style", "dates"].indexOf(step) >= 0
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 ${
                ["style", "dates"].indexOf(step) >= 0
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            />
            <div
              className={`flex-1 ${
                step === "dates" ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 justify-between mt-6">
          <Button
            onClick={handlePrev}
            variant="outline"
            disabled={step === "places"}
          >
            이전
          </Button>

          {step === "dates" ? (
            <Button
              onClick={handleCreate}
              className="flex-1"
              disabled={ title.trim() === "" || !startDate || !endDate || endDate < startDate }
            >
              여행 만들기
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="flex-1"
              disabled={
                (step === "places" && title.trim() === "")
              }
            >
              다음
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
