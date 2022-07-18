import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonageController } from './zonage.controller';
import { ZonageEntity } from './zonage.entity';
import { ZonageService } from './zonage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZonageEntity])
  ],
  controllers: [ZonageController],
  providers: [ZonageService], // Ajouter l'autre repository appeler dans le service dans le provider 
  exports: [ZonageService]
})
export class ZonageModule { }
