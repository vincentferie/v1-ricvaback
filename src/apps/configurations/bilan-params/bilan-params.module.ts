import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilanParamsController } from './bilan-params.controller';
import { BilanParamsEntity } from './bilan-params.entity';
import { BilanParamsService } from './bilan-params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BilanParamsEntity]),
  ],
  controllers: [BilanParamsController],
  providers: [BilanParamsService],
  exports: [BilanParamsService],
})
export class BilanParamsModule {}
