import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  controllers: [BookController],
  providers: [
    BookService, {
      provide: 'BOOK_REPOSITORY',
      useFactory() {
        const bookList = [
          { id: '001', title: 'book 1' },
          { id: '002', title: 'book 2' }
        ]
        return {
          findAll: () => [...bookList]
        }
      }
    }
  ],
})
export class BookModule { }
