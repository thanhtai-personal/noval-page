import Config from "react-native-config";
import Constants from 'expo-constants';

// @ts-ignore
let config = Config;
console.log("config 0", config)

if (!config?.API_BASE_URL && Config.getConstants) {
  // @ts-ignore
  config = typeof Config.getConstants === 'function' ? Config.getConstants?.() : Config;
}
console.log("config 1", config)

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.__unsafeNoWarnManifest2?.extra
}
console.log("config 2", config)

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.__unsafeNoWarnManifest?.extra
}
console.log("config 3", config)

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.expoConfig?.extra
}
console.log("config 4", config)

if (!config?.API_BASE_URL) {
  // @ts-ignore
  config = Constants.manifest?.extra
}
console.log("config 5", config)


if (!config?.API_BASE_URL) {
  config = {}
}

console.log("config 6", config)

export const envConfig = config