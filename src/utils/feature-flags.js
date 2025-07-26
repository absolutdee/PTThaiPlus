// src/utils/feature-flags.js
class FeatureFlags {
  constructor() {
    this.flags = new Map();
    this.loadFlags();
  }

  loadFlags() {
    // Load from environment variables
    const envFlags = {
      PWA_ENABLED: process.env.REACT_APP_ENABLE_PWA === 'true',
      NOTIFICATIONS_ENABLED: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
      ANALYTICS_ENABLED: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
      DARK_MODE_ENABLED: true,
      CHAT_ENABLED: true,
      PAYMENT_STRIPE_ENABLED: true,
      PAYMENT_PROMPTPAY_ENABLED: true,
      GEOLOCATION_ENABLED: true,
      OFFLINE_MODE_ENABLED: true
    };

    // Load from localStorage (for runtime toggles)
    const localFlags = JSON.parse(localStorage.getItem('featureFlags') || '{}');

    // Merge flags
    Object.entries({ ...envFlags, ...localFlags }).forEach(([key, value]) => {
      this.flags.set(key, value);
    });
  }

  isEnabled(flagName) {
    return this.flags.get(flagName) || false;
  }

  enable(flagName) {
    this.flags.set(flagName, true);
    this.saveToLocalStorage();
  }

  disable(flagName) {
    this.flags.set(flagName, false);
    this.saveToLocalStorage();
  }

  toggle(flagName) {
    const currentValue = this.flags.get(flagName) || false;
    this.flags.set(flagName, !currentValue);
    this.saveToLocalStorage();
    return !currentValue;
  }

  getAllFlags() {
    return Object.fromEntries(this.flags.entries());
  }

  saveToLocalStorage() {
    const runtimeFlags = {};
    // Only save non-environment flags
    this.flags.forEach((value, key) => {
      if (!key.startsWith('REACT_APP_')) {
        runtimeFlags[key] = value;
      }
    });
    localStorage.setItem('featureFlags', JSON.stringify(runtimeFlags));
  }
}

export const featureFlags = new FeatureFlags();

// React hook for feature flags
export const useFeatureFlag = (flagName) => {
  const [isEnabled, setIsEnabled] = useState(featureFlags.isEnabled(flagName));

  const toggle = () => {
    const newValue = featureFlags.toggle(flagName);
    setIsEnabled(newValue);
  };

  return { isEnabled, toggle };
};
