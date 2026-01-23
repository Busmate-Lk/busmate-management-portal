import { useEffect } from 'react';
import { OpenAPI } from '../../generated/api-clients/route-management';
import { useAuth } from '@/context/AuthContext';
import { getCookie } from '@/lib/utils/cookieUtils';

export const useApiToken = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Configure OpenAPI token dynamically
    OpenAPI.TOKEN = async () => {
      const token = getCookie('access_token');
      return token || '';
    };

    // Clear token when not authenticated
    if (!isAuthenticated) {
      OpenAPI.TOKEN = undefined;
    }
  }, [isAuthenticated]);
};