import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingVgmEntity } from './tracking-vgm.entity';
import { TrackingBlController } from './tracking.controller';
import { TrackingBlService } from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TrackingVgmEntity
    ]),
    HttpModule,
  ],
  controllers: [TrackingBlController],
  providers: [TrackingBlService]
})
export class TrackingBlModule {}
