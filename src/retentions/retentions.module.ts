import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Retention } from './retention.entity';
import { RetentionsService } from './retentions.service';
import { RetentionsController } from './retentions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Retention])],
  controllers: [RetentionsController], // Ini yang membuka pintu URL-nya
  providers: [RetentionsService],
  exports: [RetentionsService],
})
export class RetentionsModule {}