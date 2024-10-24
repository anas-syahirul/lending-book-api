import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { BookService } from './book.service';
import {
  BookResponse,
  CreateBookRequest,
  SearchBookRequest,
  UpdateBookRequest,
} from 'src/model/book.model';
import { WebResponse } from 'src/model/web.model';
import { BookStatus } from '@prisma/client';

@Controller('/api/book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Body() request: CreateBookRequest,
  ): Promise<WebResponse<BookResponse>> {
    const result = await this.bookService.create(request);
    return {
      statusCode: 201,
      data: result,
    };
  }

  @Get('/all')
  @HttpCode(200)
  async findAll(): Promise<WebResponse<BookResponse[]>> {
    const books = await this.bookService.findAll();
    return {
      statusCode: 200,
      data: books,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  async findOne(@Param('id') id: string): Promise<WebResponse<BookResponse>> {
    const result = await this.bookService.findOne(id);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBookRequest,
  ): Promise<WebResponse<BookResponse>> {
    const book = await this.bookService.update(id, request);
    return {
      statusCode: 200,
      data: book,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<WebResponse<boolean>> {
    this.bookService.remove(id);
    return {
      statusCode: 200,
      data: true,
    };
  }

  @Get()
  @HttpCode(200)
  async search(
    @Query('author') author?: string,
    @Query('title') title?: string,
    @Query('isbn') isbn?: string,
    @Query('status') status?: BookStatus,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('size', new ParseIntPipe({ optional: true })) size?: number,
  ): Promise<WebResponse<BookResponse[]>> {
    const request: SearchBookRequest = {
      author,
      isbn,
      title,
      status,
      page: page || 1,
      size: size || 10,
    };

    return this.bookService.search(request);
  }
}
