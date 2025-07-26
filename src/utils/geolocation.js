// src/utils/geolocation.js
export class GeolocationService {
  constructor() {
    this.watchId = null;
    this.currentPosition = null;
  }

  // Get current position
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    };

    const finalOptions = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          reject(this.handleGeolocationError(error));
        },
        finalOptions
      );
    });
  }

  // Watch position changes
  watchPosition(successCallback, errorCallback, options = {}) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    const finalOptions = { ...defaultOptions, ...options };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        successCallback(position);
      },
      (error) => {
        errorCallback(this.handleGeolocationError(error));
      },
      finalOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Handle geolocation errors
  handleGeolocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return new Error('ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่ง');
      case error.POSITION_UNAVAILABLE:
        return new Error('ไม่สามารถระบุตำแหน่งได้');
      case error.TIMEOUT:
        return new Error('หมดเวลาในการระบุตำแหน่ง');
      default:
        return new Error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
    }
  }

  // Get address from coordinates (requires Geocoding API)
  async getAddressFromCoordinates(lat, lng) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is required');
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=th`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error('ไม่สามารถระบุที่อยู่ได้');
      }
    } catch (error) {
      throw new Error('เกิดข้อผิดพลาดในการระบุที่อยู่');
    }
  }

  // Get coordinates from address (requires Geocoding API)
  async getCoordinatesFromAddress(address) {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      throw new Error('Google Maps API key is required');
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}&language=th`
      );
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          lat: location.lat,
          lng: location.lng,
          address: data.results[0].formatted_address
        };
      } else {
        throw new Error('ไม่สามารถระบุพิกัดได้');
      }
    } catch (error) {
      throw new Error('เกิดข้อผิดพลาดในการระบุพิกัด');
    }
  }
}

export const geolocationService = new GeolocationService();
