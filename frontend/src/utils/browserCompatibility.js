// Cross-browser compatibility utilities

// Browser detection
export const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  const vendor = navigator.vendor || '';
  
  // Chrome
  if (/Chrome/.test(userAgent) && /Google Inc/.test(vendor)) {
    return {
      name: 'Chrome',
      version: userAgent.match(/Chrome\/(\d+)/)?.[1],
      isChrome: true,
      isChromium: true
    };
  }
  
  // Firefox
  if (/Firefox/.test(userAgent)) {
    return {
      name: 'Firefox',
      version: userAgent.match(/Firefox\/(\d+)/)?.[1],
      isFirefox: true
    };
  }
  
  // Safari
  if (/Safari/.test(userAgent) && /Apple Computer/.test(vendor)) {
    return {
      name: 'Safari',
      version: userAgent.match(/Version\/(\d+)/)?.[1],
      isSafari: true
    };
  }
  
  // Edge
  if (/Edg/.test(userAgent)) {
    return {
      name: 'Edge',
      version: userAgent.match(/Edg\/(\d+)/)?.[1],
      isEdge: true,
      isChromium: true
    };
  }
  
  // Internet Explorer
  if (/MSIE|Trident/.test(userAgent)) {
    return {
      name: 'Internet Explorer',
      version: userAgent.match(/MSIE (\d+)|rv:(\d+)/)?.[1] || userAgent.match(/rv:(\d+)/)?.[2],
      isIE: true
    };
  }
  
  return {
    name: 'Unknown',
    version: 'Unknown',
    isUnknown: true
  };
};

// Feature detection
export const detectFeatures = () => {
  return {
    // Service Worker
    serviceWorker: 'serviceWorker' in navigator,
    
    // Push Notifications
    pushNotification: 'PushManager' in window,
    
    // Web Crypto
    webCrypto: 'crypto' in window && 'subtle' in window.crypto,
    
    // Local Storage
    localStorage: 'localStorage' in window,
    
    // Session Storage
    sessionStorage: 'sessionStorage' in window,
    
    // IndexedDB
    indexedDB: 'indexedDB' in window,
    
    // Web Share API
    webShare: 'share' in navigator,
    
    // Web Payment Request API
    paymentRequest: 'PaymentRequest' in window,
    
    // Web Bluetooth
    webBluetooth: 'bluetooth' in navigator,
    
    // Web USB
    webUSB: 'usb' in navigator,
    
    // Web NFC
    webNFC: 'nfc' in navigator,
    
    // Geolocation
    geolocation: 'geolocation' in navigator,
    
    // Camera/Microphone
    mediaDevices: 'mediaDevices' in navigator,
    
    // Screen Orientation
    screenOrientation: 'orientation' in screen,
    
    // Device Orientation
    deviceOrientation: 'DeviceOrientationEvent' in window,
    
    // Touch events
    touchEvents: 'ontouchstart' in window,
    
    // Pointer events
    pointerEvents: 'PointerEvent' in window,
    
    // Intersection Observer
    intersectionObserver: 'IntersectionObserver' in window,
    
    // Resize Observer
    resizeObserver: 'ResizeObserver' in window,
    
    // Mutation Observer
    mutationObserver: 'MutationObserver' in window,
    
    // Web Components
    webComponents: 'customElements' in window && 'shadowRoot' in Element.prototype,
    
    // CSS Grid
    cssGrid: CSS.supports('display', 'grid'),
    
    // CSS Flexbox
    cssFlexbox: CSS.supports('display', 'flex'),
    
    // CSS Custom Properties
    cssCustomProperties: CSS.supports('--test', 'red'),
    
    // CSS Aspect Ratio
    cssAspectRatio: CSS.supports('aspect-ratio', '1 / 1'),
    
    // CSS Container Queries
    cssContainerQueries: CSS.supports('container-type', 'size'),
    
    // CSS :has() selector
    cssHasSelector: CSS.supports('selector(:has(div))'),
    
    // Backdrop Filter
    backdropFilter: CSS.supports('backdrop-filter', 'blur(10px)'),
    
    // WebAssembly
    webAssembly: 'WebAssembly' in window,
    
    // OffscreenCanvas
    offscreenCanvas: 'OffscreenCanvas' in window,
    
    // Web Workers
    webWorkers: 'Worker' in window,
    
    // Shared Workers
    sharedWorkers: 'SharedWorker' in window,
    
    // Broadcast Channel
    broadcastChannel: 'BroadcastChannel' in window,
    
    // Message Channel
    messageChannel: 'MessageChannel' in window
  };
};

// Polyfill loader
export const loadPolyfills = async () => {
  const browser = detectBrowser();
  const features = detectFeatures();
  
  const polyfills = [];
  
  // IE polyfills
  if (browser.isIE) {
    polyfills.push(
      'https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es2015,es2016,es2017,es2018,es2019,fetch,Promise,Object.assign,Array.from,Array.prototype.includes,String.prototype.includes,String.prototype.startsWith,String.prototype.endsWith'
    );
  }
  
  // Service Worker polyfill
  if (!features.serviceWorker) {
    polyfills.push('https://cdn.jsdelivr.net/npm/service-worker-polyfill@1.0.1/index.js');
  }
  
  // Intersection Observer polyfill
  if (!features.intersectionObserver) {
    polyfills.push('https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver');
  }
  
  // Resize Observer polyfill
  if (!features.resizeObserver) {
    polyfills.push('https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver');
  }
  
  // CSS Custom Properties polyfill for older browsers
  if (!features.cssCustomProperties) {
    polyfills.push('https://cdn.jsdelivr.net/npm/css-vars-ponyfill@2.4.8/dist/css-vars-ponyfill.min.js');
  }
  
  // Load polyfills
  for (const polyfill of polyfills) {
    await loadScript(polyfill);
  }
  
  return polyfills.length;
};

const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// CSS fallbacks
export const createCSSFallbacks = () => {
  const browser = detectBrowser();
  const features = detectFeatures();
  
  let fallbacks = '';
  
  // IE specific fallbacks
  if (browser.isIE) {
    fallbacks += `
      /* IE Fallbacks */
      .flex-container {
        display: table;
        width: 100%;
      }
      .flex-item {
        display: table-cell;
        vertical-align: top;
      }
      .grid-container {
        display: block;
      }
      .grid-item {
        display: inline-block;
        width: 50%;
        float: left;
      }
    `;
  }
  
  // Safari specific fixes
  if (browser.isSafari) {
    fallbacks += `
      /* Safari Fixes */
      input[type="search"] {
        -webkit-appearance: none;
      }
      .safari-fix {
        -webkit-transform: translateZ(0);
      }
    `;
  }
  
  // Firefox specific fixes
  if (browser.isFirefox) {
    fallbacks += `
      /* Firefox Fixes */
      .firefox-fix {
        scrollbar-width: thin;
      }
    `;
  }
  
  // Touch device fallbacks
  if (!features.pointerEvents) {
    fallbacks += `
      /* Touch Fallbacks */
      .touch-target {
        min-width: 44px;
        min-height: 44px;
      }
    `;
  }
  
  if (fallbacks) {
    const style = document.createElement('style');
    style.textContent = fallbacks;
    document.head.appendChild(style);
  }
  
  return fallbacks;
};

// Browser-specific optimizations
export const optimizeForBrowser = () => {
  const browser = detectBrowser();
  const features = detectFeatures();
  
  // Chrome optimizations
  if (browser.isChrome) {
    // Enable Chrome-specific features
    if ('requestIdleCallback' in window) {
      // Use requestIdleCallback for non-critical tasks
      window.scheduleIdleWork = (callback) => {
        requestIdleCallback(callback);
      };
    }
  }
  
  // Firefox optimizations
  if (browser.isFirefox) {
    // Firefox-specific optimizations
    document.documentElement.classList.add('firefox');
  }
  
  // Safari optimizations
  if (browser.isSafari) {
    // Safari-specific optimizations
    document.documentElement.classList.add('safari');
    
    // Fix for Safari's backdrop filter performance
    if (features.backdropFilter) {
      document.documentElement.classList.add('backdrop-filter-supported');
    }
  }
  
  // Touch optimizations
  if (features.touchEvents) {
    document.documentElement.classList.add('touch-device');
    
    // Add touch-specific CSS
    const touchCSS = `
      .touch-device .hover-effect:hover {
        transform: none;
      }
      .touch-device .hover-effect:active {
        transform: scale(0.95);
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = touchCSS;
    document.head.appendChild(style);
  }
  
  // High DPI optimizations
  if (window.devicePixelRatio > 1) {
    document.documentElement.classList.add('high-dpi');
  }
  
  // Reduced motion optimizations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduced-motion');
  }
  
  // Dark mode detection
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark-mode');
  }
};

// Performance monitoring per browser
export const setupPerformanceMonitoring = () => {
  const browser = detectBrowser();
  
  // Use Performance API if available
  if ('performance' in window) {
    // Monitor navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const metrics = {
        browser: browser.name,
        version: browser.version,
        loadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstPaint: 0,
        firstContentfulPaint: 0
      };
      
      // Get paint metrics if available
      if ('PerformancePaintTiming' in window) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach(entry => {
          if (entry.name === 'first-paint') {
            metrics.firstPaint = entry.startTime;
          }
          if (entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime;
          }
        });
      }
      
      // Log metrics (in production, send to analytics)
      console.log('Performance Metrics:', metrics);
      
      // Store in localStorage for analysis
      const previousMetrics = JSON.parse(localStorage.getItem('performanceMetrics') || '[]');
      previousMetrics.push({
        ...metrics,
        timestamp: Date.now()
      });
      localStorage.setItem('performanceMetrics', JSON.stringify(previousMetrics.slice(-10))); // Keep last 10
    });
  }
};

// Error handling for browser compatibility
export const setupCompatibilityErrorHandling = () => {
  window.addEventListener('error', (event) => {
    const browser = detectBrowser();
    
    // Log browser-specific errors
    console.error('Browser Compatibility Error:', {
      browser: browser.name,
      version: browser.version,
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
    
    // Show user-friendly message for unsupported features
    if (event.message.includes('is not a function') || event.message.includes('is not defined')) {
      const features = detectFeatures();
      const missingFeatures = [];
      
      if (!features.serviceWorker && event.message.includes('serviceWorker')) {
        missingFeatures.push('Service Worker');
      }
      if (!features.webCrypto && event.message.includes('crypto')) {
        missingFeatures.push('Web Crypto API');
      }
      
      if (missingFeatures.length > 0) {
        console.warn(`Missing browser features: ${missingFeatures.join(', ')}`);
      }
    }
  });
};

// Initialize browser compatibility
export const initBrowserCompatibility = async () => {
  const browser = detectBrowser();
  const features = detectFeatures();
  
  console.log('Browser:', browser);
  console.log('Features:', features);
  
  // Load necessary polyfills
  const polyfillCount = await loadPolyfills();
  if (polyfillCount > 0) {
    console.log(`Loaded ${polyfillCount} polyfills`);
  }
  
  // Create CSS fallbacks
  createCSSFallbacks();
  
  // Optimize for current browser
  optimizeForBrowser();
  
  // Setup performance monitoring
  setupPerformanceMonitoring();
  
  // Setup error handling
  setupCompatibilityErrorHandling();
  
  return { browser, features, polyfillCount };
};
