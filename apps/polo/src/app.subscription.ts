import { AmqpSubscription } from '@gedai/nestjs-amqp';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSubscription {
  @AmqpSubscription({
    exchange: 'event.root',
    queue: 'polo-consumer',
    routingKey: 'hello.polo',
  })
  async consume() {
    Logger.log('got a message');
  }
}
