import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import HeaderBar from './HeaderBar';
import { Route, HeaderStyleInterpolator, Layout } from '../../types';
import HeaderSegment, { Scene } from './HeaderSegment';

type Props<T extends Route> = {
  layout: Layout;
  onGoBack?: () => void;
  getTitle: (props: { route: T }) => string | undefined;
  scene: Scene<T>;
  previous?: Scene<T>;
  next?: Scene<T>;
  styleInterpolator: HeaderStyleInterpolator;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderSimple<T extends Route>({
  layout,
  style,
  ...rest
}: Props<T>) {
  return (
    <HeaderBar layout={layout} style={style}>
      <HeaderSegment {...rest} layout={layout} style={styles.container} />
    </HeaderBar>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
