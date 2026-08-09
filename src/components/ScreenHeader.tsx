import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/theme/tokens';
import { IconButton } from './ui';

export function ScreenHeader({
  title,
  caption,
  dark = false,
  right,
}: {
  title: string;
  caption?: string;
  dark?: boolean;
  right?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      <IconButton icon="arrow-back" label="Go back" onPress={() => router.back()} dark={dark} />
      <View style={styles.copy}>
        <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>{title}</Text>
        {caption ? <Text style={[styles.caption, dark && styles.captionDark]}>{caption}</Text> : null}
      </View>
      {right ?? <View style={styles.placeholder} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  copy: { flex: 1 },
  title: { ...typography.heading, color: colors.ink },
  titleDark: { color: colors.white },
  caption: { ...typography.caption, color: colors.muted, marginTop: 2 },
  captionDark: { color: '#C9C1E8' },
  placeholder: { width: 42 },
});
