import { Module } from '@nestjs/common';
import { MessgeController } from './messge.controller';
import { MessgeService } from './messge.service';

@Module({
  controllers: [MessgeController],
  providers: [MessgeService]
})
export class MessgeModule {}
