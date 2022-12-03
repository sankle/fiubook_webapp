export enum HomeMenuOptions {
  ServicesList,
  BookingsList,
}

export enum Roles {
  Professor,
  Student,
  Administrative,
}

export interface Service {
  id: number;
  name: string;
  description: string;
  tags: string[];
  bookable: Boolean;
  requiresConfirmation: Boolean;
  imageUrl?: string;
  minBooking?: string;
  maxBooking?: string;
}
