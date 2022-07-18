import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupementController } from './groupement.controller';
import { GroupementEntity } from './groupement.entity';
import { GroupementService } from './groupement.service';
import { LogoGroupementEntity } from './logo/file-logo.entity';
import { PersonanlisationRepository } from './personnalisation/personnalisation.repository';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      GroupementEntity,
      LogoGroupementEntity
    ]),
    MulterModule.register({
      dest: './uploads',
    })
  ],
  controllers: [GroupementController],
  providers: [GroupementService, PersonanlisationRepository]
})
export class GroupementModule {}
