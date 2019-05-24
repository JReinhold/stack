import { Platform } from 'react-native';

/**
 * Navigators
 */
export {
  default as createStackNavigator,
} from './navigators/createStackNavigator';

export const Assets = Platform.select({
  ios: [
    require('./views/assets/back-icon.png'),
    require('./views/assets/back-icon-mask.png'),
  ],
  default: [require('./views/assets/back-icon.png')],
});
