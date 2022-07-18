import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilanDataParamsController } from './bilan-data-params.controller';
import { BilanDataParamsEntity } from './bilan-data-params.entity';
import { BilanDataParamsService } from './bilan-data-params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BilanDataParamsEntity]),
  ],
  controllers: [BilanDataParamsController],
  providers: [BilanDataParamsService],
  exports: [BilanDataParamsService],
})
export class BilanDataParamsModule {}
