import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly appService: AppService) {}

  @Post('http')
  postHelloPoloHttp(@Body() data: any) {
    this.appService.helloPoloHttp(data);
  }

  @Post('amqp')
  postHelloPoloAmqp(@Body() data: any) {
    this.appService.helloPoloAmqp(data);
  }

  @Post('hello')
  async hello() {
    this.logger.log('Hello!');
  }
}
