import { OpenTelemetryModule } from 'nestjs-otel';

/**
 * METRICS ARE NOT WORKING
 */
export class OtelModule {
  static forRoot() {
    return OpenTelemetryModule.forRoot({
      metrics: {
        hostMetrics: false,
        apiMetrics: {
          enable: true,
          ignoreRoutes: ['/favicon.ico'],
          ignoreUndefinedRoutes: false,
          defaultAttributes: {
            custom: 'mylabel',
            dummy: 'dummy',
          },
        },
      },
    });
  }
}
