import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly appService: AppService) {}

  @Post('http')
  async postHelloHttp(@Body() data: any) {
    await this.appService.helloMarcoHttp(data);
  }

  @Post('amqp')
  async postHelloAmqp(@Body() data: any) {
    await this.appService.helloMarcoAmqp(data);
  }

  @Post('hello')
  async hello() {
    this.logger.log('Hello From Polo!');
  }
}
