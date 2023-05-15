import { Injectable } from '@nestjs/common';
import { MessageDto } from './dto/messageDto';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MessgeService {
  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private maileService: MailerService,
  ) {}

  async sendMessage(dto: MessageDto) {
    try {
      await this.bot.telegram.sendMessage(process.env.CHAT_ID, dto.message);
      await this.maileService.sendMail({
        from: process.env.EMAIL_HOST_USER,
        to: process.env.EMAIL_SEND,
        subject: 'сообщение с сайта',
        text: dto.message,
        html: `<i>${dto.message}</i>`,
      });
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      throw new Error('не удалось отправить сообщение');
    }
  }
}
