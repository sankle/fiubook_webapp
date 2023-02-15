export enum HomeMenuOptions {
  ServicesList,
  BookingsList,
  NewService,
  RequestsList,
}

export enum Roles {
  Professor = 'PROFESSOR',
  Student = 'STUDENT',
  Administrative = 'NODO',
  SystemAdmin = 'ADMIN',
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

export enum BookingType {
  AUTOMATIC = 'AUTOMATIC',
  REQUIRES_CONFIRMATION = 'REQUIRES_CONFIRMATION',
}

export interface UserCredentials {
  dni: number;
  password: number;
}
