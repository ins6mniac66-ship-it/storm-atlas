import { Platform } from 'react-native';

export const releaseConfig = {
  // The local scanner remains a native development workflow; Expo web preview
  // must mirror the release navigation and never expose the local-only tab.
  enableScanner: __DEV__ && Platform.OS !== 'web',
  betaSignupUrl: '',
  betaContactEmail: '',
};
