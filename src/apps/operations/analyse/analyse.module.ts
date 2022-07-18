import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalysesController } from './analyse.controller';
import { AnalysesEntity } from './analyse.entity';
import { AnalysesService } from './analyse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnalysesEntity])
  ],
  controllers: [AnalysesController],
  providers: [AnalysesService]
})
export class AnalysesModule {}
