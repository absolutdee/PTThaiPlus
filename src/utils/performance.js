// src/utils/performance.js
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.isSupported = 'PerformanceObserver' in window;
  }

  // Start timing a operation
  startTiming(label) {
    if (performance.mark) {
      performance.mark(`${label}-start`);
    }
    this.metrics.set(label, { startTime: performance.now() });
  }

  // End timing and return duration
  endTiming(label) {
    const metric = this.metrics.get(label);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    if (performance.mark && performance.measure) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    }

    this.metrics.set(label, { ...metric, endTime, duration });
    return duration;
  }

  // Measure function execution time
  measureFunction(fn, label) {
    return async (...args) => {
      this.startTiming(label);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        this.endTiming(label);
      }
    };
  }

  // Monitor Core Web Vitals
  monitorWebVitals() {
    if (!this.isSupported) return;

    // Largest Contentful Paint (LCP)
    this.observeMetric('largest-contentful-paint', (entries) => {
      const lcpEntry = entries[entries.length - 1];
      this.reportMetric('LCP', lcpEntry.startTime);
    });

    // First Input Delay (FID)
    this.observeMetric('first-input', (entries) => {
      entries.forEach(entry => {
        this.reportMetric('FID', entry.processingStart - entry.startTime);
      });
    });

    // Cumulative Layout Shift (CLS)
    this.observeMetric('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.reportMetric('CLS', clsValue);
    });
  }

  // Observe specific performance metric
  observeMetric(type, callback) {
    if (!this.isSupported) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ type, buffered: true });
      this.observers.set(type, observer);
    } catch (error) {
      console.warn(`Failed to observe ${type}:`, error);
    }
  }

  // Report metric to analytics
  reportMetric(name, value) {
    console.log(`Performance ${name}:`, value);
    
    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        metric_value: Math.round(value),
        custom_map: { metric_name: name }
      });
    }
  }

  // Monitor resource loading
  monitorResources() {
    if (!this.isSupported) return;

    this.observeMetric('resource', (entries) => {
      entries.forEach(entry => {
        const duration = entry.responseEnd - entry.startTime;
        
        // Report slow resources
        if (duration > 1000) { // More than 1 second
          this.reportMetric('slow_resource', {
            name: entry.name,
            duration: duration,
            size: entry.transferSize
          });
        }
      });
    });
  }

  // Monitor navigation timing
  getNavigationTiming() {
    if (!performance.getEntriesByType) return null;

    const nav = performance.getEntriesByType('navigation')[0];
    if (!nav) return null;

    return {
      dns: nav.domainLookupEnd - nav.domainLookupStart,
      tcp: nav.connectEnd - nav.connectStart,
      request: nav.responseStart - nav.requestStart,
      response: nav.responseEnd - nav.responseStart,
      dom: nav.domContentLoadedEventEnd - nav.responseEnd,
      load: nav.loadEventEnd - nav.loadEventStart,
      total: nav.loadEventEnd - nav.navigationStart
    };
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if (!performance.memory) return null;

    return {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) // MB
    };
  }

  // Monitor frame rate
  monitorFrameRate() {
    let frames = 0;
    let lastTime = performance.now();

    const countFrame = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        this.reportMetric('FPS', frames);
        frames = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrame);
    };

    requestAnimationFrame(countFrame);
  }

  // Get all metrics
  getAllMetrics() {
    return {
      timing: this.getNavigationTiming(),
      memory: this.getMemoryUsage(),
      custom: Object.fromEntries(this.metrics)
    };
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.monitorWebVitals();
  performanceMonitor.monitorResources();
}
