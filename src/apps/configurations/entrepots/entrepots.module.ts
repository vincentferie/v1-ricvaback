import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntrepotEntity } from './entrepot.entity';
import { EntrepotsController } from './entrepots.controller';
import { EntrepotsService } from './entrepots.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntrepotEntity])
  ],
  controllers: [EntrepotsController],
  providers: [EntrepotsService] // Ajouter l'autre repository appeler dans le service dans le provider 
})
export class EntrepotsModule { }
