import { AmqpModule } from '@gedai/nestjs-amqp';
import { CommonConfigModule } from '@gedai/nestjs-common';
import { ContextModule } from '@gedai/nestjs-core';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppSubscription } from './app.subscription';

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
          // :: KEEP LAYOUT
          { name: 'event.root' },
        ],
        trafficInspection: { mode: 'all' },
      }),
    }),
    CommonConfigModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        appName: config.get('SERVICE_NAME', 'marco-local'),
        environment: config.get('NODE_ENV', 'development'),
        httpTrafficInspection: { mode: 'all' },
        routePrefix: config.get('ROUTE_PREFIX', ''),
        logger: {
          format: config.get('LOG_FORMAT', 'json'),
          level: config.get('LOG_LEVEL', 'info'),
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppSubscription],
})
export class AppModule {}
