import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import {
  CreateReservationRequest,
  UpdateReservationRequest,
} from 'src/model/reservation.model';
import { ValidationService } from 'src/common/validation.service';
import { ReservationValidation } from './reservation.validation';
import { User } from '@prisma/client';

@Injectable()
export class ReservationService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}
  async create(user: User, request: CreateReservationRequest) {
    const createRequest: CreateReservationRequest =
      this.validationService.validate(ReservationValidation.CREATE, request);
    // Check if the book exists
    const book = await this.prismaService.book.findUnique({
      where: { id: createRequest.bookId },
    });
    if (!book) {
      throw new HttpException(
        `Book with ID ${createRequest.bookId} not found`,
        404,
      );
    }

    // Check if the book is either AVAILABLE or BORROWED
    if (book.status !== 'AVAILABLE' && book.status !== 'BORROWED') {
      throw new HttpException('Book is not available for reservation', 400);
    }
    if (user.role === 'STAFF') {
      // Check if the user exists
      const userMember = await this.prismaService.user.findUnique({
        where: { id: createRequest.userId },
      });
      if (!userMember) {
        throw new HttpException(
          `User with ID ${createRequest.userId} not found`,
          404,
        );
      }
    }

    // Create the reservation record
    const reservation = await this.prismaService.reservation.create({
      data:
        user.role === 'MEMBER'
          ? createRequest
          : {
              reservationDate: createRequest.reservationDate,
              status: createRequest.status,
              userId: user.id,
              bookId: createRequest.bookId,
            },
    });

    // Update the book status to 'RESERVED' (if it's currently AVAILABLE)
    if (book.status === 'AVAILABLE') {
      await this.prismaService.book.update({
        where: { id: createRequest.bookId },
        data: { status: 'RESERVED' },
      });
    }

    return reservation;
  }

  async findAll(user: User) {
    let reservations = null;
    if (user.role === 'STAFF') {
      reservations = await this.prismaService.borrowing.findMany();
    } else {
      reservations = await this.prismaService.borrowing.findMany({
        where: {
          userId: user.id,
        },
      });
    }
    return reservations;
  }

  async findOne(id: string) {
    const reservation = await this.prismaService.reservation.findUnique({
      where: {
        id,
      },
    });
    return reservation;
  }

  async update(id: string, request: UpdateReservationRequest) {
    const updateRequest: UpdateReservationRequest =
      this.validationService.validate(ReservationValidation.UPDATE, request);
    const existingReservation = await this.prismaService.reservation.findUnique(
      {
        where: { id },
      },
    );
    if (!existingReservation) {
      throw new HttpException(`Reservation with ID ${id} not found`, 404);
    }

    // Check if the book exists
    const book = await this.prismaService.book.findUnique({
      where: { id: updateRequest.bookId },
    });
    if (!book) {
      throw new HttpException(
        `Book with ID ${updateRequest.bookId} not found`,
        404,
      );
    }

    // Check if the user exists
    const user = await this.prismaService.user.findUnique({
      where: { id: updateRequest.userId },
    });
    if (!user) {
      throw new HttpException(
        `User with ID ${updateRequest.userId} not found`,
        404,
      );
    }

    // Update the reservation record
    const updatedReservation = await this.prismaService.reservation.update({
      where: { id },
      data: updateRequest,
    });

    return updatedReservation;
  }

  async remove(id: string) {
    const existReservation = await this.prismaService.reservation.findUnique({
      where: {
        id,
      },
    });
    if (!existReservation) {
      throw new HttpException('invalid reservation id', 404);
    }

    const reservation = await this.prismaService.reservation.delete({
      where: {
        id,
      },
    });

    return reservation;
  }
}
