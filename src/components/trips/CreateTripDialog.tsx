"use client";

import { useState, useCallback, useEffect } from "react";
import { useTripsStore } from "@/store/tripsStore";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TravelStyle } from "@/types/trip";
import { TRAVEL_STYLES } from "@/constants/trip";
import { cn } from "@/lib/utils";

type Step = "places" | "companions" | "style" | "dates";

interface CreateTripWizardProps {
  variant?: "button" | "iconBox";
}

const COMPANION_OPTIONS = ["혼자", "친구와", "가족과", "연인과", "배우자와", "아이와", "부모님과"];

export default function CreateTripDialog({ variant = "button" }: CreateTripWizardProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("places");
  const [title, setTitle] = useState("");
  const [companions, setCompanions] = useState<string>("");
  const [companionType, setCompanionType] = useState<string>("");
  const [showCompanionInput, setShowCompanionInput] = useState(false);
  const [styles, setStyles] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [numberOfMonths, setNumberOfMonths] = useState(1);

  const addTrip = useTripsStore((state) => state.addTrip);

  const handleNext = useCallback(() => {
    if (step === "places") {
      setStep("companions");
    } else if (step === "companions") {
      setStep("style");
    } else if (step === "style") {
      setStep("dates");
    }
  }, [step]);

  const handlePrev = useCallback(() => {
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
  }, [step]);

  const handleCompanionTypeSelect = useCallback((type: string) => {
    if (type === "기타") {
      setCompanionType(type);
      setShowCompanionInput(true);
      setCompanions("");
    } else {
      setCompanionType(type);
      setShowCompanionInput(false);
      setCompanions(type);
    }
  }, []);

  const handleAddCustomCompanion = useCallback(() => {
    if (companions.trim()) {
      setCompanions(companions.trim());
      setCompanions("");
    }
  }, [companions]);

  const handleCreate = useCallback(() => {
    if (title.trim() === "") {
      setTitle("");
    }

    addTrip({
      id: crypto.randomUUID(),
      title: title.trim() || "제목 없음",
      places: [],
      companions: companionType === "혼자" ? undefined : companions,
      travelStyles: styles.length > 0 ? (styles as TravelStyle[]) : undefined,
      startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
      endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
      createdAt: new Date().toISOString(),
    });

    setTitle("");
    setCompanions("");
    setCompanionType("");
    setShowCompanionInput(false);
    setStyles([]);
    setDateRange(undefined);
    setDatePopoverOpen(false);
    setStep("places");
    setOpen(false);
  }, [title, companionType, companions, styles, dateRange, addTrip]);

  const handleDateRangeSelect = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
  }, []);

  useEffect(() => {
    const updateMonths = () => {
      setNumberOfMonths(window.innerWidth >= 768 ? 2 : 1);
    };

    updateMonths();
    window.addEventListener("resize", updateMonths);
    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "iconBox" ? (  
          <div className="flex items-center p-4 bg-linear-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 cursor-pointer">
            <Button size="lg" className="bg-transparent hover:bg-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="var(--primary)" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </Button>
            <div className="flex-1">
              <p className="font-medium text-sm">여행 일정 만들기</p>
              <p className="text-xs text-muted-foreground">새로운 여행을 떠나보세요.</p>
            </div>
          </div>
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
          {step === "places" && (
            <div className="space-y-3">
              <label htmlFor="place-input" className="text-sm font-medium mb-4 block">
                여행의 이름을 입력해주세요. <span className="text-primary">*</span>
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

          {step === "companions" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">동행자 선택</label>
              <div className="flex flex-wrap gap-2">
                {[...COMPANION_OPTIONS, "기타"].map((option) => (
                  <button
                    key={option}
                    onClick={() => handleCompanionTypeSelect(option)}
                    className={`px-5 py-2 rounded-full border-2 font-medium text-sm transition-colors ${
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
                <div className="space-y-2 mt-4">
                  <label htmlFor="companion-custom-input" className="text-sm font-medium hidden"></label>
                  <div className="flex gap-2">
                    <Input
                      id="companion-custom-input"
                      placeholder="누구랑 떠나시나요?"
                      value={companions}
                      onChange={(e) => setCompanions(e.target.value)}
                    />
                    <Button onClick={handleAddCustomCompanion} variant="outline" size="sm" className="h-9">
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

          {step === "style" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">여행 스타일 선택</label>
              <div className="grid grid-cols-2 gap-2">
                {TRAVEL_STYLES.map((s) => (
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

          {step === "dates" && (
            <div className="space-y-3">
              <label className="text-sm font-medium mb-4 block">
                여행 날짜 <span className="text-primary">*</span>
              </label>
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="trip-date-range"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "yyyy.MM.dd")} - {format(dateRange.to, "yyyy.MM.dd")}
                        </>
                      ) : (
                        format(dateRange.from, "yyyy.MM.dd")
                      )
                    ) : (
                      <span>날짜를 선택해주세요</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="fixed! left-1/2! top-1/2! -translate-x-1/2! -translate-y-1/2! w-auto max-w-[80vw] min-w-75 bg-white p-0"
                  align="center"
                >
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={handleDateRangeSelect}
                    numberOfMonths={numberOfMonths}
                  />
                  <div className="flex justify-end border-t p-2">
                    <Button
                      size="sm"
                      onClick={() => setDatePopoverOpen(false)}
                      disabled={!dateRange?.from || !dateRange?.to}
                    >
                      완료
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="flex gap-0 mt-6 rounded-full overflow-hidden h-1 bg-gray-200">
            <div className={`flex-1 ${["places", "companions", "style", "dates"].indexOf(step) >= 0 ? "bg-blue-500" : "bg-gray-200"}`} />
            <div className={`flex-1 ${["companions", "style", "dates"].indexOf(step) >= 0 ? "bg-blue-500" : "bg-gray-200"}`} />
            <div className={`flex-1 ${["style", "dates"].indexOf(step) >= 0 ? "bg-blue-500" : "bg-gray-200"}`} />
            <div className={`flex-1 ${step === "dates" ? "bg-blue-500" : "bg-gray-200"}`} />
          </div>
        </div>

        <div className="flex gap-2 justify-between mt-6">
          <Button onClick={handlePrev} variant="outline" disabled={step === "places"}>
            이전
          </Button>

          {step === "dates" ? (
            <Button
              onClick={handleCreate}
              className="flex-1"
              disabled={title.trim() === "" || !dateRange?.from || !dateRange?.to}
            >
              여행 만들기
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex-1" disabled={step === "places" && title.trim() === ""}>
              다음
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
