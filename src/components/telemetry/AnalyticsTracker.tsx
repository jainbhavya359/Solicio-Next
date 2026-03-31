'use client';
import { useProductAnalytics } from '@/src/hooks/useProductAnalytics';

export default function AnalyticsTracker() {
  useProductAnalytics();
  return null;
}
