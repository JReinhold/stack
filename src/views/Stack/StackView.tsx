import * as React from 'react';
import { SceneView, StackActions } from '@react-navigation/core';
import Stack from './Stack';
import {
  DefaultTransition,
  ModalSlideFromBottomIOS,
} from '../../TransitionConfigs/TransitionPresets';
import {
  NavigationProp,
  SceneDescriptor,
  NavigationConfig,
  Route,
} from '../../types';
import { Platform } from 'react-native';

type Props = {
  navigation: NavigationProp;
  descriptors: { [key: string]: SceneDescriptor };
  navigationConfig: NavigationConfig;
  onTransitionStart?: () => void;
  onGestureBegin?: () => void;
  onGestureCanceled?: () => void;
  onGestureEnd?: () => void;
  screenProps?: unknown;
};

type State = {
  initialRouteKeys: string[];
  currentRoutes: Route[];
  closingRoutes: Route[];
  descriptors: { [key: string]: SceneDescriptor | undefined };
};

class StackView extends React.Component<Props, State> {
  static getDerivedStateFromProps(
    props: Readonly<Props>,
    state: Readonly<State>
  ) {
    const propsRouteKeys = props.navigation.state.routes.map(r => r.key);
    const closingRouteKeys = state.closingRoutes.map(r => r.key);
    const closingRoutes = [...state.closingRoutes];

    // Add any removed routes in `props` to `closingRoutes`
    state.currentRoutes.forEach(route => {
      if (
        !propsRouteKeys.includes(route.key) &&
        !closingRouteKeys.includes(route.key)
      ) {
        closingRoutes.push(route);
      }
    });

    return {
      currentRoutes: props.navigation.state.routes,
      closingRoutes,
      descriptors: { ...state.descriptors, ...props.descriptors },
    };
  }

  state: State = {
    initialRouteKeys: this.props.navigation.state.routes.map(
      route => route.key
    ),
    currentRoutes: this.props.navigation.state.routes,
    closingRoutes: [],
    descriptors: {},
  };

  private getTitle = ({ route }: { route: Route }) => {
    const descriptor = this.state.descriptors[route.key];
    const { headerTitle, title } = descriptor
      ? descriptor.options
      : { headerTitle: undefined, title: undefined };

    return headerTitle !== undefined ? headerTitle : title;
  };

  private renderScene = ({ route }: { route: Route }) => {
    const descriptor = this.state.descriptors[route.key];

    if (!descriptor) {
      return null;
    }

    const { navigation, getComponent } = descriptor;
    const SceneComponent = getComponent();

    const { screenProps } = this.props;

    return (
      <SceneView
        screenProps={screenProps}
        navigation={navigation}
        component={SceneComponent}
      />
    );
  };

  private handleGoBack = ({ route }: { route: Route }) =>
    this.props.navigation.dispatch(StackActions.pop({ key: route.key }));

  private handleCloseRoute = ({ route }: { route: Route }) => {
    this.setState(state => ({
      initialRouteKeys: state.initialRouteKeys.filter(key => key !== route.key),
      closingRoutes: state.closingRoutes.filter(r => r.key !== route.key),
      currentRoutes: state.currentRoutes.filter(r => r.key !== route.key),
      descriptors: { ...state.descriptors, [route.key]: undefined },
    }));

    this.props.navigation.dispatch(
      StackActions.pop({ key: route.key, immediate: true })
    );
  };

  render() {
    const { navigation, navigationConfig } = this.props;
    const { initialRouteKeys, closingRoutes } = this.state;

    const TransitionPreset =
      navigationConfig.mode === 'modal' && Platform.OS === 'ios'
        ? ModalSlideFromBottomIOS
        : DefaultTransition;
    const headerMode =
      navigationConfig.headerMode || TransitionPreset.headerMode;

    return (
      <Stack
        {...TransitionPreset}
        routes={[...navigation.state.routes, ...closingRoutes]}
        headerMode={headerMode}
        initialRoutes={initialRouteKeys}
        closingRoutes={closingRoutes.map(r => r.key)}
        onGoBack={this.handleGoBack}
        onCloseRoute={this.handleCloseRoute}
        getTitle={this.getTitle}
        renderScene={this.renderScene}
      />
    );
  }
}

export default StackView;
