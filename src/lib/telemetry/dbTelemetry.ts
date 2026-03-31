import mongoose from 'mongoose';
import { logger } from './logger';

export function setupDbTelemetry() {
  // Only add the plugin once
  if (mongoose.connection && (mongoose.connection as any)._telemetryAdded) {
    return;
  }
  
  mongoose.plugin((schema) => {
    const ops = ['find', 'findOne', 'updateOne', 'updateMany', 'aggregate'];
    
    schema.pre(ops as any[], function (this: any) {
      this._startTime = performance.now();
    });

    schema.post(ops as any[], function (this: any, res: any, next: any) {
      const executionTimeMs = performance.now() - this._startTime;
      const collectionName = this?.mongooseCollection?.name || 'unknown';
      const operationType = this?.op || 'unknown';
      
      if (process.env.NODE_ENV !== 'production' || executionTimeMs > 100) {
        logger.debug({
          event_type: 'db_query',
          metadata: {
              'db.execution_time_ms': Math.round(executionTimeMs),
              'db.collection_name': collectionName,
              'db.operation_type': operationType
          }
        }, `DB Query executed: ${collectionName}.${operationType}`);
      }
      if (next) next();
    });
  });

  (mongoose.connection as any)._telemetryAdded = true;
}
