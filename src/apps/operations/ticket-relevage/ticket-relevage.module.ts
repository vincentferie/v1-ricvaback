import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { TicketRelevageController } from './ticket-relevage.controller';
import { TicketRelevageService } from './ticket-relevage.service';
import { TicketRelevageEntity } from './ticket-relevage.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FileTicketRelevageEntity } from './file-ticket/file-ticket-relevage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketRelevageEntity,
      FileTicketRelevageEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [TicketRelevageController],
  providers: [TicketRelevageService]
})
export class TicketRelevageModule { }
