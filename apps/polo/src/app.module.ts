import { AmqpModule } from '@gedai/nestjs-amqp';
import { CommonConfigModule } from '@gedai/nestjs-common';
import { ContextModule } from '@gedai/nestjs-core';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContextModule.forRoot({}),
    HttpModule.register({}),
    AmqpModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        url: config.get('AMQP_URL'),
        exchanges: [
          { name: 'event.root' },
          //
        ],
        trafficInspection: { mode: 'all' },
      }),
    }),
    CommonConfigModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        appName: config.get('SERVICE_NAME', 'polo-local'),
        environment: config.get('NODE_ENV', 'development'),
        httpTrafficInspection: { mode: 'all' },
        logger: {
          format: config.get('LOG_FORMAT', 'json'),
          level: config.get('LOG_LEVEL', 'info'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
