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
import { ReservationService } from './reservation.service';
import {
  CreateReservationRequest,
  ReservationResponse,
  UpdateReservationRequest,
} from 'src/model/reservation.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @HttpCode(201)
  async create(
    @Auth() user: User,
    @Body() request: CreateReservationRequest,
  ): Promise<WebResponse<ReservationResponse>> {
    const result = await this.reservationService.create(user, request);
    return {
      statusCode: 201,
      data: result,
    };
  }

  @Get('/all')
  @HttpCode(200)
  async findAll(
    @Auth() user: User,
  ): Promise<WebResponse<ReservationResponse[]>> {
    const result = await this.reservationService.findAll(user);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Get('/:id')
  @HttpCode(200)
  async findOne(
    @Param('id') id: string,
  ): Promise<WebResponse<ReservationResponse>> {
    const result = await this.reservationService.findOne(id);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Patch('/:id')
  @HttpCode(200)
  async update(
    @Param('id') id: string,
    @Body() request: UpdateReservationRequest,
  ): Promise<WebResponse<ReservationResponse>> {
    const result = await this.reservationService.update(id, request);
    return {
      statusCode: 200,
      data: result,
    };
  }

  @Delete('/:id')
  @HttpCode(200)
  async remove(@Param('id') id: string): Promise<WebResponse<boolean>> {
    this.reservationService.remove(id);

    return {
      statusCode: 200,
      data: true,
    };
  }
}
