import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConteneurEntity } from './conteneur.entity';
import { ConteneursController } from './conteneur.controller';
import { ConteneursService } from './conteneur.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConteneurEntity])
  ],
  controllers: [ConteneursController],
  providers: [ConteneursService]
})
export class ConteneursModule {}
