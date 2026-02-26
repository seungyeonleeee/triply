// trip
export type TravelStyle =
  | "체험·액티비티"
  | "SNS 핫플레이스"
  | "자연과 함께"
  | "유명 관광지 필수"
  | "여유롭게 힐링"
  | "문화·예술·역사"
  | "쇼핑은 열정적으로"
  | "관광보다 먹방";

export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  places: Place[];
  companions?: string;
  travelStyles?: TravelStyle[];
  createdAt: string;
  checklist?: ChecklistItem[];
}

// Place in Trip
export type Category = string;

export type TransportKind = "flight" | "bus" | "taxi" | "subway" | "walk";

export type TripItemType = "place" | "stay" | "memo" | "transport" | "flight";

export interface Place {
  id: string;
  name: string;
  day: number;
  type: TripItemType;
  time?: string;
  category: Category;
  transportKind?: TransportKind;
  address?: string;
  lat?: number;
  lng?: number;
  memo?: string;
}

// ChecklistItem in Trip
export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
  category?: string;
}



