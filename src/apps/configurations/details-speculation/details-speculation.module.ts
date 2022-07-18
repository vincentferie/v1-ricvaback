import { Module } from '@nestjs/common';
import { DetailsSpeculationController } from './details-speculation.controller';
import { DetailsSpeculationService } from './details-speculation.service';
import { DetailsSpeculationEntity } from './detail-speculation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([DetailsSpeculationEntity])
  ],
  controllers: [DetailsSpeculationController],
  providers: [DetailsSpeculationService],
  exports: [DetailsSpeculationService]
})
export class DetailsSpeculationModule { }
