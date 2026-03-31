import { NextResponse } from 'next/server';
import { logger } from '@/src/lib/telemetry/logger';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    let body;
    try { 
      body = JSON.parse(text); 
    } catch { 
      return NextResponse.json({ ok: false }, { status: 400 }); 
    }

    const { event_type, url, duration_seconds, session_id, user_id, ...metadata } = body;

    logger.info(
      { 
        event_type: event_type || 'custom_event',
        url,
        duration_seconds,
        session_id,
        user_id,
        ...metadata
      }, 
      `Frontend Event: ${event_type}`
    );

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
