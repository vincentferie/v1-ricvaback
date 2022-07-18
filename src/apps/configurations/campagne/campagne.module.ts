import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampagneSpecRepository } from '../campagne-spec/campagne-spec.repository';
import { CampagneController } from './campagne.controller';
import { CampagneEntity } from './campagne.entity';
import { CampagneService } from './campagne.service';
import { CampagneOutturnRepository } from './outturn/outturn.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([CampagneEntity]),
  ],
  controllers: [CampagneController],
  providers: [CampagneService, CampagneSpecRepository, CampagneOutturnRepository]
})
export class CampagneModule {}
