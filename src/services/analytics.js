// src/services/analytics.js
class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.events = [];
    this.pageViews = [];
  }

  // Initialize analytics
  init(config = {}) {
    const {
      trackingId = process.env.REACT_APP_GA_TRACKING_ID,
      debug = process.env.NODE_ENV === 'development',
      userId = null
    } = config;

    this.trackingId = trackingId;
    this.debug = debug;
    this.userId = userId;

    // Initialize Google Analytics if tracking ID is provided
    if (trackingId && typeof window !== 'undefined') {
      this.initGoogleAnalytics(trackingId);
    }

    // Initialize custom tracking
    this.initCustomTracking();
    
    this.isInitialized = true;
    this.log('Analytics initialized');
  }

  // Initialize Google Analytics
  initGoogleAnalytics(trackingId) {
    // Load gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', trackingId, {
      send_page_view: false // We'll handle page views manually
    });
  }

  // Initialize custom tracking
  initCustomTracking() {
    // Track session start
    this.trackEvent('session_start', {
      session_id: this.sessionId,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.trackEvent('page_focus');
      } else {
        this.trackEvent('page_blur');
      }
    });

    // Track unload
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        session_duration: Date.now() - this.sessionStartTime
      });
      this.sendQueuedEvents();
    });

    this.sessionStartTime = Date.now();
  }

  // Set user ID
  setUserId(userId) {
    this.userId = userId;
    
    if (window.gtag) {
      window.gtag('config', this.trackingId, {
        user_id: userId
      });
    }

    this.trackEvent('user_login', { user_id: userId });
  }

  // Track page view
  pageView(path, title = document.title) {
    const pageData = {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId
    };

    this.pageViews.push(pageData);

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', this.trackingId, {
        page_path: path,
        page_title: title
      });
    }

    // Custom tracking
    this.trackEvent('page_view', pageData);
    
    this.log('Page view tracked:', pageData);
  }

  // Track custom event
  trackEvent(eventName, eventData = {}) {
    const event = {
      event_name: eventName,
      event_data: eventData,
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId,
      page_path: window.location.pathname,
      page_url: window.location.href
    };

    this.events.push(event);

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', eventName, eventData);
    }

    // Send to custom analytics endpoint
    this.sendEvent(event);

    this.log('Event tracked:', event);
  }

  // Business-specific tracking methods
  trackUserSignup(method, userType) {
    this.trackEvent('sign_up', {
      method: method,
      user_type: userType
    });
  }

  trackLogin(method, userType) {
    this.trackEvent('login', {
      method: method,
      user_type: userType
    });
  }

  trackSearch(searchTerm, category, resultCount) {
    this.trackEvent('search', {
      search_term: searchTerm,
      category: category,
      result_count: resultCount
    });
  }

  trackTrainerView(trainerId, trainerName) {
    this.trackEvent('trainer_view', {
      trainer_id: trainerId,
      trainer_name: trainerName
    });
  }

  trackBookingStart(trainerId, packageId) {
    this.trackEvent('booking_start', {
      trainer_id: trainerId,
      package_id: packageId
    });
  }

  trackBookingComplete(bookingId, trainerId, packageId, amount) {
    this.trackEvent('booking_complete', {
      booking_id: bookingId,
      trainer_id: trainerId,
      package_id: packageId,
      amount: amount,
      currency: 'THB'
    });
  }

  trackPaymentStart(method, amount) {
    this.trackEvent('payment_start', {
      payment_method: method,
      amount: amount,
      currency: 'THB'
    });
  }

  trackPaymentComplete(paymentId, method, amount) {
    this.trackEvent('payment_complete', {
      payment_id: paymentId,
      payment_method: method,
      amount: amount,
      currency: 'THB'
    });
  }

  trackSessionStart(sessionId, trainerId) {
    this.trackEvent('workout_session_start', {
      session_id: sessionId,
      trainer_id: trainerId
    });
  }

  trackSessionComplete(sessionId, duration) {
    this.trackEvent('workout_session_complete', {
      session_id: sessionId,
      duration: duration
    });
  }

  trackChatMessage(recipientType) {
    this.trackEvent('chat_message_sent', {
      recipient_type: recipientType // 'trainer' or 'client'
    });
  }

  trackReviewSubmit(rating, trainerId) {
    this.trackEvent('review_submit', {
      rating: rating,
      trainer_id: trainerId
    });
  }

  trackProgressUpdate(metricType, value) {
    this.trackEvent('progress_update', {
      metric_type: metricType,
      value: value
    });
  }

  // E-commerce tracking
  trackPurchase(transactionId, items, value) {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'THB',
      items: items
    });
  }

  trackAddToCart(item) {
    this.trackEvent('add_to_cart', {
      currency: 'THB',
      value: item.price,
      items: [item]
    });
  }

  // Error tracking
  trackError(error, errorInfo = {}) {
    this.trackEvent('error', {
      error_message: error.message || error,
      error_stack: error.stack,
      error_info: errorInfo,
      page_path: window.location.pathname
    });
  }

  // Performance tracking
  trackPerformance(metricName, value, unit = 'ms') {
    this.trackEvent('performance', {
      metric_name: metricName,
      value: value,
      unit: unit
    });
  }

  // Send event to backend
  async sendEvent(event) {
    if (!this.isInitialized) return;

    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      this.log('Failed to send event:', error);
    }
  }

  // Send queued events (for page unload)
  sendQueuedEvents() {
    if (navigator.sendBeacon && this.events.length > 0) {
      const data = JSON.stringify({
        events: this.events,
        pageViews: this.pageViews
      });
      
      navigator.sendBeacon('/api/analytics/batch', data);
    }
  }

  // Get analytics data
  async getAnalytics(params = {}) {
    try {
      const response = await fetch('/api/analytics/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(params)
      });
      
      return await response.json();
    } catch (error) {
      this.log('Failed to get analytics:', error);
      return null;
    }
  }

  // Utility methods
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  log(...args) {
    if (this.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  // Get user insights
  getUserInsights(userId) {
    return this.getAnalytics({
      type: 'user_insights',
      user_id: userId,
      date_range: '30d'
    });
  }

  // Get trainer performance
  getTrainerPerformance(trainerId) {
    return this.getAnalytics({
      type: 'trainer_performance',
      trainer_id: trainerId,
      date_range: '30d'
    });
  }

  // Get platform metrics
  getPlatformMetrics() {
    return this.getAnalytics({
      type: 'platform_metrics',
      date_range: '30d'
    });
  }
}

export const analyticsService = new AnalyticsService();

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  analyticsService.init();
}
