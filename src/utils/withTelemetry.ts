import { NextResponse } from 'next/server';
import { logger } from '@/src/lib/telemetry/logger';
import { v4 as uuidv4 } from 'uuid'; // Project already has uuid

export function withTelemetry(handler: (req: Request, ...args: any[]) => Promise<Response>) {
  return async function (req: Request, ...args: any[]) {
    const start = performance.now();
    const trace_id = req.headers.get('x-trace-id') || uuidv4();
    const url = new URL(req.url);

    try {
      logger.info({ trace_id, url: url.pathname, method: req.method }, `API Request Started: ${url.pathname}`);
      
      const response = await handler(req, ...args);
      
      const latency_ms = Math.round(performance.now() - start);
      logger.info(
        { trace_id, latency_ms, status: response.status },
        `API Request Completed: ${url.pathname}`
      );
      
      return response;
    } catch (error: any) {
      const latency_ms = Math.round(performance.now() - start);
      logger.error(
        { trace_id, latency_ms, error: error.message || error.toString(), stack: error.stack },
        `API Request Error: ${url.pathname}`
      );
      
      // Standardize generic 500 errors to prevent leaking stack traces to clients
      return NextResponse.json(
        { error: "Internal Server Error", message: process.env.NODE_ENV === 'development' ? error.message : undefined }, 
        { status: 500 }
      );
    }
  };
}
