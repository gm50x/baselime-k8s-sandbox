import { ContextService } from '@gedai/nestjs-core';
import { INestApplication, Logger } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

function appendTraceIdToHeaders(
  options: http.RequestOptions,
  contextId: string,
) {
  if (!options.headers) {
    options.headers = {};
  }
  options.headers['x-trace-id'] = contextId;
}

function mountTraceInterceptor(
  context: ContextService,
  module: typeof http | typeof https,
) {
  const withTraceId = (target: typeof module.get | typeof module.request) =>
    function (...args: any[]) {
      const traceId = context.getTrace();
      if (!traceId) {
        return target.apply(this, args);
      }
      const [urlOrOptions, optionsOrCallback, maybeCallback] = args;
      // http.get(url, options, callback)
      if (typeof urlOrOptions === 'string' && maybeCallback) {
        appendTraceIdToHeaders(optionsOrCallback, traceId);
        return target.apply(this, [
          urlOrOptions,
          optionsOrCallback,
          maybeCallback,
        ]);
      }
      // http.get(url, callback)
      if (typeof urlOrOptions === 'string') {
        const options = {};
        appendTraceIdToHeaders(options, traceId);
        return target.apply(this, [urlOrOptions, options, optionsOrCallback]);
      }
      // http.get(options, callback)
      appendTraceIdToHeaders(urlOrOptions, traceId);
      return target.apply(this, [urlOrOptions, optionsOrCallback]);
    };
  const targets = [
    { target: module.get, name: 'get' },
    { target: module.request, name: 'request' },
  ];
  for (const { target, name } of targets) {
    const tracedTarged = withTraceId(target);
    Object.defineProperty(tracedTarged, 'name', {
      value: name,
      writable: false,
    });
    module[name] = tracedTarged;
  }
}

export const configureOutboundHttpTracePropagation = (
  app: INestApplication,
) => {
  const context = app.get(ContextService);
  for (const module of [http, https]) {
    mountTraceInterceptor(context, module);
  }
  Logger.log('Http Trace Propagation initialized', '@gedai/common/config');
  return app;
};
