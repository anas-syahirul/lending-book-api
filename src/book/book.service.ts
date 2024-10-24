import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  BookResponse,
  CreateBookRequest,
  SearchBookRequest,
  UpdateBookRequest,
} from 'src/model/book.model';
import { BookValidation } from './book.validation';
import { Book } from '@prisma/client';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class BookService {
  private readonly secretKey: string;
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('JWT_SECRET');
  }

  async create(request: CreateBookRequest) {
    const createRequest: CreateBookRequest = this.validationService.validate(
      BookValidation.CREATE,
      request,
    );
    const book = await this.prismaService.book.create({
      data: createRequest,
    });
    return this.toBookResponse(book);
  }

  toBookResponse(book: Book): BookResponse {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publishedAt: book.publishedAt,
      copies: book.copies,
      status: book.status,
    };
  }

  async findAll() {
    const books = await this.prismaService.book.findMany();
    return books;
  }

  async findOne(id: string) {
    const book = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    return book;
  }

  async update(id: string, request: UpdateBookRequest) {
    const updateRequest: UpdateBookRequest = this.validationService.validate(
      BookValidation.UPDATE,
      request,
    );
    const existBook = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    if (!existBook) {
      throw new HttpException('invalid book id', 404);
    }

    const book = await this.prismaService.book.update({
      where: {
        id,
      },
      data: updateRequest,
    });

    return book;
  }

  async remove(id: string) {
    const existBook = await this.prismaService.book.findUnique({
      where: {
        id,
      },
    });
    if (!existBook) {
      throw new HttpException('invalid book id', 404);
    }

    const book = await this.prismaService.book.delete({
      where: {
        id,
      },
    });

    return book;
  }

  async search(
    request: SearchBookRequest,
  ): Promise<WebResponse<BookResponse[]>> {
    const searchRequest: SearchBookRequest = this.validationService.validate(
      BookValidation.SEARCH,
      request,
    );

    const filters = [];

    if (searchRequest.author) {
      filters.push({
        author: {
          contains: searchRequest.author,
        },
      });
    }
    if (searchRequest.status) {
      filters.push({
        status: searchRequest.status,
      });
    }
    if (searchRequest.isbn) {
      filters.push({
        isbn: {
          contains: searchRequest.isbn,
        },
      });
    }
    if (searchRequest.title) {
      filters.push({
        title: {
          contains: searchRequest.title,
        },
      });
    }

    const skip = (searchRequest.page - 1) * searchRequest.size;

    const books = await this.prismaService.book.findMany({
      where: {
        AND: filters,
      },
      take: searchRequest.size,
      skip,
    });

    const total = await this.prismaService.book.count({
      where: {
        AND: filters,
      },
    });

    return {
      statusCode: 200,
      data: books.map((book) => this.toBookResponse(book)),
      paging: {
        current_page: searchRequest.page,
        size: searchRequest.size,
        total_page: Math.ceil(total / searchRequest.size),
      },
    };
  }
}
