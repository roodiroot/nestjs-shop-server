import { Body, Controller, Post } from '@nestjs/common';
import { MessageDto } from './dto/messageDto';
import { MessgeService } from './messge.service';

@Controller('message')
export class MessgeController {
  constructor(private messageService: MessgeService) {}

  @Post()
  sendMessage(@Body() dto: MessageDto) {
    return this.messageService.sendMessage(dto);
  }
}
