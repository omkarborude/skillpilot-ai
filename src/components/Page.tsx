import { PropsWithChildren } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout, spacing } from '@/theme/tokens';

type PageProps = PropsWithChildren<{
  scroll?: boolean;
  keyboardAware?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  tabScreen?: boolean;
  dark?: boolean;
}>;

export function Page({
  children,
  scroll = true,
  keyboardAware = false,
  contentStyle,
  tabScreen = false,
  dark = false,
}: PageProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = dark ? colors.night : colors.canvas;
  const bottomPadding = tabScreen
    ? layout.tabBarHeight + spacing.xl
    : Math.max(insets.bottom, spacing.lg) + spacing.lg;

  const content = scroll ? (
    <ScrollView
      style={[styles.fill, { backgroundColor }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingBottom: bottomPadding,
        },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.content,
        styles.fill,
        {
          backgroundColor,
          paddingTop: Math.max(insets.top, spacing.md) + spacing.xs,
          paddingBottom: bottomPadding,
        },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  if (!keyboardAware) return content;

  return (
    <KeyboardAvoidingView
      style={[styles.fill, { backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: {
    width: '100%',
    maxWidth: layout.maxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: layout.horizontalPadding,
  },
});
