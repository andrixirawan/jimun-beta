import axios from 'axios';
import { Platform } from 'react-native';
import { getPublicApiBaseUrl } from '../config/public-env';

const getClientType = () => {
  switch (Platform.OS) {
    case 'ios':
      return 'ios';
    case 'android':
      return 'android';
    case 'web':
      return 'web';
    default:
      return 'native';
  }
};

export const httpClient = axios.create({
  baseURL: getPublicApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Type': getClientType(),
  },
});
