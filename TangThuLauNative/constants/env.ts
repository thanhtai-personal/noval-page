import Config from "react-native-config";
import Constants from 'expo-constants';

// @ts-ignore
let config = Config;

if (!config?.API_BASE_URL && Config.getConstants) {
  // @ts-ignore
  config = typeof Config.getConstants === 'function' ? Config.getConstants?.() : Config;
}

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.__unsafeNoWarnManifest2.extra
}

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.__unsafeNoWarnManifest.extra
}

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.expoConfig?.extra
}

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.manifest.extra
}


if (!config?.API_BASE_URL) {
  config = {}
}

console.log("config", config)

export const envConfig = config