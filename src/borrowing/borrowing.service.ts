import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  CreateBorrowingRequest,
  UpdateBorrowingRequest,
} from 'src/model/borrowing.model';
import { BorrowingValidation } from './borrowing.validation';
import { User } from '@prisma/client';

@Injectable()
export class BorrowingService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}
  async create(user: User, request: CreateBorrowingRequest) {
    const createRequest: CreateBorrowingRequest =
      this.validationService.validate(BorrowingValidation.CREATE, request);
    const book = await this.prismaService.book.findUnique({
      where: { id: createRequest.bookId },
    });
    if (!book) {
      throw new HttpException(`Invalid book id`, 404);
    }
    if (book.status !== 'AVAILABLE') {
      throw new HttpException('Book is not available for borrowing', 400);
    }
    const borrowing = await this.prismaService.borrowing.create({
      data:
        user.role === 'STAFF'
          ? createRequest
          : {
              userId: user.id,
              bookId: createRequest.bookId,
              borrowDate: new Date(),
              dueDate: createRequest.dueDate,
            },
    });
    await this.prismaService.book.update({
      where: { id: createRequest.bookId },
      data: { status: 'BORROWED' },
    });

    return borrowing;
  }

  async findAll(user: User) {
    let borrowings = null;
    if (user.role === 'STAFF') {
      borrowings = await this.prismaService.borrowing.findMany();
    } else {
      borrowings = await this.prismaService.borrowing.findMany({
        where: {
          userId: user.id,
        },
      });
    }
    return borrowings;
  }

  async findOne(id: string) {
    const borrowing = await this.prismaService.borrowing.findUnique({
      where: {
        id,
      },
    });
    return borrowing;
  }

  async update(id: string, request: UpdateBorrowingRequest) {
    const updateRequest: UpdateBorrowingRequest =
      this.validationService.validate(BorrowingValidation.UPDATE, request);
    const existBorrowing = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    if (!existBorrowing) {
      throw new HttpException('invalid borrowing id', 404);
    }

    const borrowing = await this.prismaService.borrowing.update({
      where: {
        id,
      },
      data: updateRequest,
    });

    return borrowing;
  }

  async remove(id: string) {
    const existBorrowing = await this.prismaService.borrowing.findUnique({
      where: {
        id,
      },
    });
    if (!existBorrowing) {
      throw new HttpException('invalid borrowing id', 404);
    }

    const borrowing = await this.prismaService.borrowing.delete({
      where: {
        id,
      },
    });

    return borrowing;
  }
}
