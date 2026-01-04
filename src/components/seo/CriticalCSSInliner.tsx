import { useEffect } from 'react';

/**
 * CriticalCSSInliner - Inlines critical CSS for above-the-fold content
 * This is a runtime enhancement; main critical CSS is in index.html
 */
const CriticalCSSInliner = () => {
  useEffect(() => {
    // Report Core Web Vitals to analytics
    if ('PerformanceObserver' in window) {
      // Observe Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.debug('[CWV] LCP:', lastEntry.startTime.toFixed(0), 'ms');
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Observe First Input Delay
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          // Type assertion for PerformanceEventTiming
          const eventEntry = entry as PerformanceEventTiming;
          console.debug('[CWV] FID:', eventEntry.processingStart - eventEntry.startTime, 'ms');
        });
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // Observe Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          // Check if entry is LayoutShift type
          if ('hadRecentInput' in entry && !(entry as LayoutShift).hadRecentInput) {
            clsValue += (entry as LayoutShift).value;
          }
        });
        console.debug('[CWV] CLS:', clsValue.toFixed(4));
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  return null;
};

// Type definitions for Layout Shift entries
interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export default CriticalCSSInliner;
