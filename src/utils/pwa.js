export const isPWA = () => {
  return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
};

export const isInstallable = () => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const installPrompt = (() => {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  return {
    show: async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        return outcome === 'accepted';
      }
      return false;
    },
    isAvailable: () => !!deferredPrompt
  };
})();

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/logo192.png',
      badge: '/logo192.png',
      ...options
    });
  }
  return null;
};

export const subscribeToNotifications = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.REACT_APP_VAPID_PUBLIC_KEY
      });
      
      // Send subscription to your server
      await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription)
      });
      
      return subscription;
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  }
  return null;
};