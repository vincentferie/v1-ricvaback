import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BilanNumCompteController } from './bilan-num-compte.controller';
import { BilanCompteParamsEntity } from './bilan-num-compte.entity';
import { BilanNumCompteService } from './bilan-num-compte.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BilanCompteParamsEntity]),
  ],
  controllers: [BilanNumCompteController],
  providers: [BilanNumCompteService],
  exports: [BilanNumCompteService],
})
export class BilanNumCompteModule {}
