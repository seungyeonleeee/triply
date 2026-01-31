export interface Place {
  id: string;
  name: string;
  memo?: string;
}

export interface Trip {
  id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  places: Place[];
  createdAt: string;
}
