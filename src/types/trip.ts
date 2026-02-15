export interface Place {
  id: string;
  name: string;
  memo?: string;
}

export type TravelStyle = "활동적" | "휴식" | "문화" | "미식" | "모험";

export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  places: Place[];
  companions?: string[]; // 동행자 목록
  travelStyle?: TravelStyle; // 여행 스타일
  createdAt: string;
}
