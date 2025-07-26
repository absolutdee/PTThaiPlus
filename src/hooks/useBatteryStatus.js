// src/hooks/useBatteryStatus.js
import { useState, useEffect } from 'react';

export const useBatteryStatus = () => {
  const [batteryInfo, setBatteryInfo] = useState({
    supported: false,
    charging: false,
    level: 1,
    chargingTime: Infinity,
    dischargingTime: Infinity
  });

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        const updateBatteryInfo = () => {
          setBatteryInfo({
            supported: true,
            charging: battery.charging,
            level: battery.level,
            chargingTime: battery.chargingTime,
            dischargingTime: battery.dischargingTime
          });
        };

        updateBatteryInfo();

        battery.addEventListener('chargingchange', updateBatteryInfo);
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingtimechange', updateBatteryInfo);
        battery.addEventListener('dischargingtimechange', updateBatteryInfo);

        return () => {
          battery.removeEventListener('chargingchange', updateBatteryInfo);
          battery.removeEventListener('levelchange', updateBatteryInfo);
          battery.removeEventListener('chargingtimechange', updateBatteryInfo);
          battery.removeEventListener('dischargingtimechange', updateBatteryInfo);
        };
      });
    }
  }, []);

  return batteryInfo;
};
