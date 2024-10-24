import { ReservationStatus } from '@prisma/client';

export class CreateReservationRequest {
  reservationDate: Date;
  status: ReservationStatus;
  userId: string;
  bookId: string;
}
export class UpdateReservationRequest {
  reservationDate?: Date;
  status?: ReservationStatus;
  userId?: string;
  bookId?: string;
}

export class ReservationResponse {
  id: string;
  reservationDate: Date;
  status: ReservationStatus;
  userId: string;
  bookId: string;
}
