import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { BookModule } from './book/book.module';
import { BorrowingModule } from './borrowing/borrowing.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookModule,
    BorrowingModule,
    ReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
