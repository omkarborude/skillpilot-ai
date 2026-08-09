import { ComponentProps, PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { TechniqueStatus } from '@/types/learning';
import { colors, radius, shadows, spacing, typography } from '@/theme/tokens';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, shadows.card, style]}>{children}</View>;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  icon,
  style,
}: ButtonProps) {
  const content = (
    <View style={styles.buttonContent}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary} />
      ) : icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={variant === 'primary' ? colors.white : variant === 'danger' ? colors.danger : colors.primary}
        />
      ) : null}
      <Text
        style={[
          styles.buttonLabel,
          variant !== 'primary' && styles.secondaryButtonLabel,
          variant === 'danger' && styles.dangerButtonLabel,
          disabled && styles.disabledText,
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'ghost' && styles.ghostButton,
        variant === 'danger' && styles.dangerButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[colors.primary, '#7B4DFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      ) : (
        content
      )}
    </Pressable>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  dark = false,
}: {
  icon: IconName;
  onPress: () => void;
  label: string;
  dark?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        dark && styles.iconButtonDark,
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name={icon} color={dark ? colors.white : colors.ink} size={21} />
    </Pressable>
  );
}

export function Pill({
  children,
  tone = 'purple',
}: PropsWithChildren<{ tone?: 'purple' | 'green' | 'amber' | 'neutral' }>) {
  return (
    <View
      style={[
        styles.pill,
        tone === 'green' && styles.pillGreen,
        tone === 'amber' && styles.pillAmber,
        tone === 'neutral' && styles.pillNeutral,
      ]}
    >
      <Text
        style={[
          styles.pillText,
          tone === 'green' && styles.pillTextGreen,
          tone === 'amber' && styles.pillTextAmber,
          tone === 'neutral' && styles.pillTextNeutral,
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

export function ProgressBar({ value, dark = false }: { value: number; dark?: boolean }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: safeValue }}
      style={[styles.progressTrack, dark && styles.progressTrackDark]}
    >
      <LinearGradient
        colors={dark ? [colors.cyan, '#78F0D9'] : [colors.primary, '#8D6CFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressFill, { width: `${safeValue}%` }]}
      />
    </View>
  );
}

export function TextField({ label, error, ...props }: TextInputProps & { label?: string; error?: string }) {
  return (
    <View style={styles.fieldGroup}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[styles.input, error && styles.inputError]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export function SelectionCard({
  title,
  caption,
  selected,
  onPress,
  leading,
}: {
  title: string;
  caption?: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.selectionCard,
        selected && styles.selectionCardSelected,
        pressed && styles.pressed,
      ]}
    >
      {leading}
      <View style={styles.selectionCopy}>
        <Text style={styles.selectionTitle}>{title}</Text>
        {caption ? <Text style={styles.selectionCaption}>{caption}</Text> : null}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  caption,
}: {
  eyebrow?: string;
  title: string;
  caption?: string;
}) {
  return (
    <View style={styles.sectionHeading}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.sectionTitle}>{title}</Text>
      {caption ? <Text style={styles.sectionCaption}>{caption}</Text> : null}
    </View>
  );
}

const statusConfig: Record<
  TechniqueStatus,
  { label: string; icon: IconName; background: string; color: string }
> = {
  completed: { label: 'Completed', icon: 'checkmark-circle', background: colors.successSoft, color: colors.success },
  in_progress: { label: 'In progress', icon: 'flash', background: colors.primarySoft, color: colors.primary },
  locked: { label: 'Locked', icon: 'lock-closed', background: '#F1F0F4', color: colors.muted },
  skipped: { label: 'Skipped', icon: 'play-skip-forward', background: colors.warningSoft, color: '#A86700' },
};

export function StatusBadge({ status }: { status: TechniqueStatus }) {
  const config = statusConfig[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: config.background }]}>
      <Ionicons name={config.icon} size={13} color={config.color} />
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  button: { minHeight: 52, borderRadius: radius.md, overflow: 'hidden', justifyContent: 'center' },
  gradient: { minHeight: 52, justifyContent: 'center', paddingHorizontal: spacing.lg },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, paddingHorizontal: spacing.md },
  buttonLabel: { ...typography.label, color: colors.white, fontSize: 15 },
  secondaryButtonLabel: { color: colors.primary },
  dangerButtonLabel: { color: colors.danger },
  secondaryButton: { borderWidth: 1, borderColor: colors.primarySoft, backgroundColor: colors.surface },
  ghostButton: { backgroundColor: colors.surfaceAlt },
  dangerButton: { backgroundColor: colors.dangerSoft },
  disabledButton: { opacity: 0.5 },
  disabledText: { opacity: 0.8 },
  pressed: { opacity: 0.78, transform: [{ scale: 0.99 }] },
  iconButton: { width: 42, height: 42, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  iconButtonDark: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.16)' },
  pill: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.primarySoft },
  pillGreen: { backgroundColor: colors.successSoft },
  pillAmber: { backgroundColor: colors.warningSoft },
  pillNeutral: { backgroundColor: '#F0EEF4' },
  pillText: { ...typography.caption, color: colors.primaryDark, fontWeight: '700' },
  pillTextGreen: { color: colors.success },
  pillTextAmber: { color: '#9A6200' },
  pillTextNeutral: { color: colors.inkSoft },
  progressTrack: { height: 9, borderRadius: radius.pill, backgroundColor: colors.primarySoft, overflow: 'hidden' },
  progressTrackDark: { backgroundColor: 'rgba(255,255,255,0.14)' },
  progressFill: { height: '100%', borderRadius: radius.pill },
  fieldGroup: { gap: 6 },
  fieldLabel: { ...typography.label, color: colors.ink },
  input: { minHeight: 52, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.ink, paddingHorizontal: spacing.md, ...typography.body },
  inputError: { borderColor: colors.danger },
  errorText: { ...typography.caption, color: colors.danger },
  selectionCard: { minHeight: 66, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  selectionCardSelected: { borderColor: colors.primary, backgroundColor: '#FBFAFF' },
  selectionCopy: { flex: 1, gap: 2 },
  selectionTitle: { ...typography.label, color: colors.ink, fontSize: 14 },
  selectionCaption: { ...typography.caption, color: colors.muted },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  sectionHeading: { gap: spacing.xxs },
  eyebrow: { ...typography.label, color: colors.primary, textTransform: 'uppercase', letterSpacing: 0.7 },
  sectionTitle: { ...typography.heading, color: colors.ink },
  sectionCaption: { ...typography.body, color: colors.muted },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 6 },
  statusText: { ...typography.caption, fontWeight: '700' },
});
