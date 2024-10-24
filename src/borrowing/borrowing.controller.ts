import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { BorrowingService } from './borrowing.service';
import {
  BorrowingResponse,
  CreateBorrowingRequest,
  UpdateBorrowingRequest,
} from 'src/model/borrowing.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/borrowing')
export class BorrowingController {
  constructor(private readonly borrowingService: BorrowingService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() request: CreateBorrowingRequest,
  ): Promise<WebResponse<BorrowingResponse>> {
    const result = await this.borrowingService.create(user, request);
    return {
      statusCode: 201,
      data: result,
    };
  }

  @Get('/all')
  @HttpCode(200)
  async findAll(@Auth() user: User): Promise<WebResponse<BorrowingResponse[]>> {
    const result = await this.borrowingService.findAll(user);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<BorrowingResponse>> {
    const result = await this.borrowingService.findOne(id);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() request: UpdateBorrowingRequest,
  ): Promise<WebResponse<BorrowingResponse>> {
    const result = await this.borrowingService.update(id, request);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Delete('/:id')
  async remove(@Param('id') id: string): Promise<WebResponse<boolean>> {
    this.borrowingService.remove(id);

    return {
      statusCode: 200,
      data: true,
    };
  }
}
