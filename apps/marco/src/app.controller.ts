import { TracedMetadata } from '@gedai/nestjs-common';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly appService: AppService) {}

  @Post('http')
  @TracedMetadata([{ name: 'namespace', value: 'hello-http' }])
  async postHelloHttp(@Body() data: any) {
    await this.appService.helloPoloHttp(data);
  }

  @Post('amqp')
  @TracedMetadata([{ name: 'namespace', value: 'hello-amqp' }])
  async postHelloAmqp(@Body() data: any) {
    await this.appService.helloPoloAmqp(data);
  }

  @Post('hello')
  @TracedMetadata([{ name: 'namespace', value: 'hello' }])
  async hello(@Body() data: any) {
    if (data.error) {
      this.logger.error('Throwing an error 😎');
      throw new Error(data.error);
    }

    this.logger.log('Hello From Marco! 😁');
  }
}
