import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotEntity } from '../lots/lot.entity';
import { SessionController } from './session.controller';
import { SessionEntity } from './session.entity';
import { SessionService } from './session.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SessionEntity,
      LotEntity
    ])
  ],
  controllers: [SessionController],
  providers: [SessionService]
})
export class SessionModule {}
