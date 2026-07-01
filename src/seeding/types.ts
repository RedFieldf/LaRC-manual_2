export interface SeedingRecord {
  id: string;
  date: string;
  name: string;
  density?: string;
  cellVol: number;
  collagenVol: number;
  note?: string;
  uid: string;
  createdAt: string;
}
