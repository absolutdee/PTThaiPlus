import { useState, useEffect } from 'react';
import { installPrompt, requestNotificationPermission, isPWA } from '../utils/pwa';

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(isPWA());
  const [notificationPermission, setNotificationPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  useEffect(() => {
    const checkInstallable = () => {
      setIsInstallable(installPrompt.isAvailable());
    };

    const checkInstalled = () => {
      setIsInstalled(isPWA());
    };

    // Check periodically
    const interval = setInterval(() => {
      checkInstallable();
      checkInstalled();
    }, 1000);

    // Initial check
    checkInstallable();
    checkInstalled();

    return () => clearInterval(interval);
  }, []);

  const install = async () => {
    const result = await installPrompt.show();
    if (result) {
      setIsInstallable(false);
      setIsInstalled(true);
    }
    return result;
  };

  const enableNotifications = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission ? 'granted' : 'denied');
    return permission;
  };

  return {
    isInstallable,
    isInstalled,
    notificationPermission,
    install,
    enableNotifications
  };
};