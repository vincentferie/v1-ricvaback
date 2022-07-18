import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncotemsController } from './incotems.controller';
import { IncotemsEntity } from './incotems.entity';
import { IncotemsService } from './incotems.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([IncotemsEntity])
  ],
  controllers: [IncotemsController],
  providers: [IncotemsService],
  exports: [IncotemsService]
})
export class IncotemsModule {}
