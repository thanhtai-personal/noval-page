import Config from 'react-native-config';
import Constants from 'expo-constants';

// Try to read values from react-native-config first
let config: any = Config;

if (!config?.API_BASE_URL && typeof Config.getConstants === 'function') {
  // @ts-ignore
  config = Config.getConstants();
}

// Fallback to expo constants (development or Expo Go)
if (!config?.API_BASE_URL) {
  const expoConstants =
    // @ts-ignore - some of these fields are private
    Constants.expoConfig ?? Constants?.manifest2 ?? Constants.manifest;

  if (expoConstants) {
    config = (expoConstants as any).extra ?? expoConstants;
  }
}

if (!config?.API_BASE_URL) {
  config = process.env;
}

if (!config?.API_BASE_URL) {
  config = {};
}

config.API_BASE_URL = "http://192.168.1.39:5000" //for test

export const envConfig = config;
