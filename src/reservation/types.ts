export interface Reservation {
  id: string;
  date: string;
  resourceId: string;
  time: string;
  name: string;
  note?: string;
  uid: string;
  createdAt: string;
  purpose?: string;
  wavelength?: string;
}

export interface TimeSlot {
  id: string;
  label: string;
}

export interface BookingStatus {
  allowed: boolean;
  reason?: string;
}
