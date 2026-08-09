import { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';
import { IconButton } from './ui';

export function ActionSheet({
  visible,
  onClose,
  title,
  caption,
  children,
}: PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title: string;
  caption?: string;
}>) {
  const { width } = useWindowDimensions();
  const centered = width >= 768;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.root, centered && styles.rootCentered]}>
        <Pressable accessibilityLabel="Close dialog" style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={[styles.sheet, centered && styles.dialog]}>
          <View style={styles.header}>
            <View style={styles.copy}>
              <Text style={styles.title}>{title}</Text>
              {caption ? <Text style={styles.caption}>{caption}</Text> : null}
            </View>
            <IconButton icon="close" label="Close" onPress={onClose} />
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  rootCentered: { justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  sheet: { width: '100%', maxHeight: '88%', backgroundColor: colors.surface, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, padding: spacing.xl, gap: spacing.lg },
  dialog: { maxWidth: 520, borderRadius: radius.xl },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  copy: { flex: 1, gap: spacing.xxs },
  title: { ...typography.heading, color: colors.ink },
  caption: { ...typography.body, color: colors.muted },
});
