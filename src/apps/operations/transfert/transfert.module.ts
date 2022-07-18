import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfertEntity } from './transfert.entity';
import { TransfertsController } from './transfert.controller';
import { TransfertsService } from './transfert.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransfertEntity])
  ],
  controllers: [TransfertsController],
  providers: [TransfertsService]
})
export class TransfertsModule {}
