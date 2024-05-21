import { AmqpService } from '@gedai/nestjs-amqp';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly amqp: AmqpService,
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async helloPoloAmqp(data: any) {
    await this.amqp.publish('event.root', 'hello.polo', data);
  }

  async helloPoloHttp(data: any) {
    const poloURL = this.config.get('POLO_URL');
    await this.http.axiosRef.post(`${poloURL}/hellox`, data);
  }

  async helloMarcoAmqp(data: any) {
    await this.amqp.publish('event.root', 'hello.marco', data);
  }

  async helloMarcoHttp(data: any) {
    const marcoURL = this.config.get('MARCO_URL');
    await this.http.axiosRef.post(`${marcoURL}/hello`, data);
  }
}
