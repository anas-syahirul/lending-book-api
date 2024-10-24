export class CreateBorrowingRequest {
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  userId: string;
  bookId: string;
}
export class UpdateBorrowingRequest {
  borrowDate?: Date;
  dueDate?: Date;
  returnDate?: Date;
  userId?: string;
  bookId?: string;
}

export class BorrowingResponse {
  id: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  userId?: string;
  bookId: string;
}
