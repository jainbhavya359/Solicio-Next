'use client';
import { useEffect, useCallback, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export function useProductAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const startTime = useRef(Date.now());
  const sessionId = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('solicio_session_id')) {
        sessionStorage.setItem('solicio_session_id', uuidv4());
      }
      sessionId.current = sessionStorage.getItem('solicio_session_id');
    }
  }, []);

  const capture = useCallback((eventName: string, metadata: any = {}) => {
    if (typeof window === 'undefined') return;

    const payload = {
      event_type: eventName,
      url: window.location.href,
      session_id: sessionId.current,
      ...metadata
    };
    
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/telemetry/event', JSON.stringify(payload));
      } else {
        fetch('/api/telemetry/event', {
          method: 'POST',
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(() => {});
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    startTime.current = Date.now();
    capture('page_view', { pathname, searchParams: searchParams?.toString() });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const durationSec = Math.round((Date.now() - startTime.current) / 1000);
        if (durationSec > 0) {
           capture('page_exit', { pathname, duration_seconds: durationSec });
        }
      } else if (document.visibilityState === 'visible') {
        startTime.current = Date.now();
      }
    };

    const handleBeforeUnload = () => {
      const durationSec = Math.round((Date.now() - startTime.current) / 1000);
      if (durationSec > 0) {
        capture('page_exit', { pathname, duration_seconds: durationSec });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname, searchParams, capture]);

  return { capture };
}
