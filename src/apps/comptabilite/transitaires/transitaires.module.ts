import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransitairesController } from './transitaires.controller';
import { TransitairesEntity } from './transitaires.entity';
import { TransitairesService } from './transitaires.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransitairesEntity])
  ],
  controllers: [TransitairesController],
  providers: [TransitairesService]
})
export class TransitairesModule {}
