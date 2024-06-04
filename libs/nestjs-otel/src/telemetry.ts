import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { AmqplibInstrumentation } from '@opentelemetry/instrumentation-amqplib';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { WinstonInstrumentation } from '@opentelemetry/instrumentation-winston';
import { Resource } from '@opentelemetry/resources';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import {
  SEMRESATTRS_HOST_NAME,
  SEMRESATTRS_SERVICE_NAME,
} from '@opentelemetry/semantic-conventions';
import { randomInt } from 'crypto';
import * as process from 'process';
import { Subject, tap } from 'rxjs';

const {
  ENABLE_OTEL,
  BASE_URL_OTEL_COLLECTOR,
  API_KEY_OTEL_COLLECTOR,
  SERVICE_NAME,
  HOSTNAME,
} = process.env;

console.log({ ENABLE_OTEL });
if (ENABLE_OTEL === 'true') {
  /** IF USING GPRC */

  console.log({ BASE_URL_OTEL_COLLECTOR, API_KEY_OTEL_COLLECTOR });
  const traceExporter = new OTLPTraceExporter({
    url: BASE_URL_OTEL_COLLECTOR,
    headers: {
      'x-api-key': API_KEY_OTEL_COLLECTOR,
    },
  });

  const metricExporter = new OTLPMetricExporter({
    url: BASE_URL_OTEL_COLLECTOR,
    headers: {
      'x-api-key': API_KEY_OTEL_COLLECTOR,
    },
  });

  const resource = new Resource({
    [SEMRESATTRS_SERVICE_NAME]: SERVICE_NAME || 'unknown-service',
    [SEMRESATTRS_HOST_NAME]: HOSTNAME,
  });

  const meterProvider = new MeterProvider({
    resource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: metricExporter,
      }),
    ],
  });

  // THIS POLUTES TOO MUCH
  // const hostMetrics = new HostMetrics({
  //   name: 'lui-example-host-metrics',
  //   meterProvider,
  // });

  setTimeout(() => {
    /** TODO: This is a test and must be removed and cleaned up */
    const meter = meterProvider.getMeter('sumisumi-sample-meter');

    const c = meter.createCounter('sumisumi_malaka', {
      description: 'this is a counter',
    });

    const h = meter.createHistogram('sumisumi_molika', {
      description: 'this is a histogram',
    });

    const g = meter.createObservableGauge('sumisumi_maritaka', {
      description: 'this is a gauge',
    });
    let gauge = 0;
    g.addCallback((r) => {
      // console.log('addCallbackWasTriggeredWith:', gauge);
      return r.observe(gauge);
    });
    const setGauge = (value: number) => {
      gauge = value;
    };

    const $subject = new Subject<number>();
    const $obs = $subject.asObservable().pipe(
      // tap((value) => console.log(`$Observable::${value}`)),
      tap((value) => h.record(value, { pid: process.pid })),
      tap((value) => c.add(value, { pid: process.pid })),
      tap((value) => setGauge(value)),
    );
    $obs.subscribe();

    setInterval(() => {
      const random = randomInt(100);
      // console.log('################### Triggering Metrics ###################');
      // console.log(`################### ${random} ###################`);
      $subject.next(random);
      // console.log(
      //   '################### Metric Triggered Metrics ###################',
      // );
    }, 5000);
  }, 15000);

  const otelSDK = new NodeSDK({
    contextManager: new AsyncLocalStorageContextManager(),
    spanProcessor: new BatchSpanProcessor(traceExporter),
    resource,
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new NestInstrumentation(),
      new WinstonInstrumentation(),
      new AmqplibInstrumentation(),
      new MongooseInstrumentation(),
    ],
  });

  otelSDK.start();
  // TODO: HOSTMETRICS DISABLED
  // hostMetrics.start();

  // process.on('SIGTERM', () => {
  //   otelSDK
  //     .shutdown()
  //     .then(
  //       () =>
  //         console.log(
  //           JSON.stringify({
  //             message: 'SDK shut down successfully 🚀',
  //             timestamp: new Date(),
  //           }),
  //         ),
  //       (err) =>
  //         console.error(
  //           JSON.stringify({
  //             message: 'Error shuttind down sdk 🚀',
  //             error: { message: err.message, stack: err.stack },
  //             timestamp: new Date(),
  //           }),
  //         ),
  //     )
  //     .finally(() => process.exit(0));
  // });
  // }

  process.on('SIGTERM', () => {
    meterProvider
      .forceFlush()
      .catch((err) =>
        console.error(
          JSON.stringify({
            message: 'Error flushing metrics 🚀',
            error: { message: err.message, stack: err.stack },
          }),
        ),
      )
      .finally(() =>
        otelSDK.shutdown().then(
          () =>
            console.log(
              JSON.stringify({
                message: 'SDK shut down successfully 🚀',
                timestamp: new Date(),
              }),
            ),
          (err) =>
            console.error(
              JSON.stringify({
                message: 'Error shuttind down sdk 🚀',
                error: { message: err.message, stack: err.stack },
                timestamp: new Date(),
              }),
            ),
        ),
      )
      .finally(() => process.exit(0));
  });
}
