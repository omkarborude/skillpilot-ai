import type { ScreenName } from './learning';

export interface AppNavigation {
  currentScreen: ScreenName;
  go: (screen: ScreenName) => void;
}
