import { AmqpSubscription } from '@gedai/nestjs-amqp';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSubscription {
  @AmqpSubscription({
    exchange: 'event.root',
    queue: 'marco-consumer',
    routingKey: 'hello.marco',
  })
  async consume() {
    Logger.log('got a message');
  }
}
