// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/api';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    method = 'GET',
    params = {},
    dependencies = [],
    immediate = true
  } = options;

  const execute = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);

      const requestOptions = {
        method: overrideOptions.method || method,
        params: { ...params, ...overrideOptions.params }
      };

      let response;
      switch (requestOptions.method.toUpperCase()) {
        case 'GET':
          response = await ApiService.get(url, { params: requestOptions.params });
          break;
        case 'POST':
          response = await ApiService.post(url, overrideOptions.data || {});
          break;
        case 'PUT':
          response = await ApiService.put(url, overrideOptions.data || {});
          break;
        case 'DELETE':
          response = await ApiService.delete(url);
          break;
        default:
          throw new Error(`Unsupported method: ${requestOptions.method}`);
      }

      setData(response);
      return response;
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, JSON.stringify(params)]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate, ...dependencies]);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch
  };
};
