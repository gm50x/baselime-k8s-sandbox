import { AmqpSubscription } from '@gedai/nestjs-amqp';
import { TracedMetadata } from '@gedai/nestjs-common';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSubscription {
  @AmqpSubscription({
    exchange: 'event.root',
    queue: 'marco-consumer',
    routingKey: 'hello.marco',
    channel: 'consumer1',
  })
  @TracedMetadata([{ name: 'namespace', value: 'consume-my-message' }])
  async consume() {
    Logger.log('got a message');
  }
}
