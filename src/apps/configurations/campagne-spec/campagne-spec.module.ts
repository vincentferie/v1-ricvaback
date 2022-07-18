import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampagneSpecController } from './campagne-spec.controller';
import { CampagneSpecEntity } from './campagne-spec.entity';
import { CampagneSpecService } from './campagne-spec.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([CampagneSpecEntity]),
  ],
  controllers: [CampagneSpecController],
  providers: [CampagneSpecService]
})
export class CampagneSpecModule {}
