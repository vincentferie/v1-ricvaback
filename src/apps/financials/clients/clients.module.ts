import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsController } from './clients.controller';
import { ClientsEntity } from './clients.entity';
import { ClientsService } from './clients.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClientsEntity])
  ],
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
