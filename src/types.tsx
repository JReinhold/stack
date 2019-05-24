import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from '@react-navigation/native';

export type Route = {
  key: string;
  routeName: string;
};

export type Scene = {
  key: string;
  index: number;
  isStale: boolean;
  isActive: boolean;
  route: Route;
  descriptor: SceneDescriptor;
};

export type NavigationEventName =
  | 'willFocus'
  | 'didFocus'
  | 'willBlur'
  | 'didBlur';

export type NavigationState = {
  key: string;
  index: number;
  routes: Route[];
  isTransitioning?: boolean;
  params?: { [key: string]: unknown };
};

export type NavigationProp<RouteName = string, Params = object> = {
  navigate(routeName: RouteName): void;
  goBack(): void;
  goBack(key: string | null): void;
  addListener: (
    event: NavigationEventName,
    callback: () => void
  ) => { remove: () => void };
  isFocused(): boolean;
  state: NavigationState;
  setParams(params: Params): void;
  getParam(): Params;
  dispatch(action: { type: string }): void;
  dangerouslyGetParent(): NavigationProp | undefined;
};

export type Layout = { width: number; height: number };

export type GestureDirection = 'horizontal' | 'vertical';

export type HeaderMode = 'float' | 'screen' | 'none';

export type HeaderProps = {
  mode: HeaderMode;
  navigation: NavigationProp;
  layout: Layout;
  scene: Scene;
  scenes: Scene[];
  backTitleVisible?: boolean;
  isLandscape: boolean;
};

export type NavigationStackOptions = {
  title?: string;
  header?: (props: HeaderProps) => React.ReactNode;
  headerTitle?: string;
  headerTitleStyle?: StyleProp<TextStyle>;
  headerTitleContainerStyle?: StyleProp<ViewStyle>;
  headerTintColor?: string;
  headerTitleAllowFontScaling?: boolean;
  headerBackAllowFontScaling?: boolean;
  headerBackTitle?: string;
  headerBackTitleStyle?: StyleProp<TextStyle>;
  headerTruncatedBackTitle?: string;
  headerLeft?: React.FunctionComponent<HeaderBackbuttonProps>;
  headerLeftContainerStyle?: StyleProp<ViewStyle>;
  headerRight?: (() => React.ReactNode) | React.ReactNode;
  headerRightContainerStyle?: StyleProp<ViewStyle>;
  headerBackImage?: React.FunctionComponent<{
    tintColor: string;
    title?: string | null;
  }>;
  headerPressColorAndroid?: string;
  headerBackground?: string;
  headerTransparent?: boolean;
  headerStyle?: StyleProp<ViewStyle>;
  headerForceInset?: React.ComponentProps<typeof SafeAreaView>['forceInset'];
  gesturesEnabled?: boolean;
  gestureDirection?: 'inverted' | 'normal';
  gestureResponseDistance?: {
    vertical: number;
    horizontal: number;
  };
  disableKeyboardHandling?: boolean;
};

export type NavigationConfig = {
  mode: 'card' | 'modal';
  headerMode: HeaderMode;
  headerBackTitleVisible?: boolean;
};

export type SceneDescriptor = {
  key: string;
  options: NavigationStackOptions;
  navigation: NavigationProp;
  getComponent(): React.ComponentType;
};

export type HeaderBackbuttonProps = {
  disabled?: boolean;
  onPress: () => void;
  pressColorAndroid?: string;
  tintColor: string;
  backImage?: NavigationStackOptions['headerBackImage'];
  title?: string | null;
  truncatedTitle?: string | null;
  backTitleVisible?: boolean;
  allowFontScaling?: boolean;
  titleStyle?: StyleProp<TextStyle>;
  width?: number;
  scene: Scene;
};

export type Screen = React.ComponentType<any> & {
  navigationOptions?: NavigationStackOptions & {
    [key: string]: any;
  };
};

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
  overshootClamping: boolean;
};

export type TimingConfig = {
  duration: number;
  easing: Animated.EasingFunction;
};

export type TransitionSpec =
  | { timing: 'spring'; config: SpringConfig }
  | { timing: 'timing'; config: TimingConfig };

export type CardInterpolationProps = {
  positions: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  closing: Animated.Node<0 | 1>;
  layout: {
    width: Animated.Node<number>;
    height: Animated.Node<number>;
  };
};

export type CardInterpolatedStyle = {
  containerStyle?: any;
  cardStyle?: any;
  overlayStyle?: any;
};

export type CardStyleInterpolator = (
  props: CardInterpolationProps
) => CardInterpolatedStyle;

export type HeaderInterpolationProps = {
  positions: {
    current: Animated.Node<number>;
    next?: Animated.Node<number>;
  };
  layouts: {
    screen: Layout;
    title?: Layout;
    backTitle?: Layout;
  };
};

export type HeaderInterpolatedStyle = {
  backTitleStyle?: any;
  leftButtonStyle?: any;
  titleStyle?: any;
};

export type HeaderStyleInterpolator = (
  props: HeaderInterpolationProps
) => HeaderInterpolatedStyle;

export type TransitionPreset = {
  direction: GestureDirection;
  headerMode: HeaderMode;
  transitionSpec: {
    open: TransitionSpec;
    close: TransitionSpec;
  };
  cardStyleInterpolator: CardStyleInterpolator;
  headerStyleInterpolator: HeaderStyleInterpolator;
};
