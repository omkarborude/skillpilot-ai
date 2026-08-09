import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadows, spacing } from '@/theme/tokens';

export function RobotMascot({ size = 'large' }: { size?: 'small' | 'large' }) {
  const small = size === 'small';
  return (
    <View style={[styles.orbit, small ? styles.orbitSmall : styles.orbitLarge]}>
      <View style={[styles.star, styles.starOne]} />
      <View style={[styles.star, styles.starTwo]} />
      <LinearGradient
        colors={['#F5F1FF', '#C9B9FF']}
        style={[styles.head, small ? styles.headSmall : styles.headLarge, shadows.card]}
      >
        <View style={[styles.face, small ? styles.faceSmall : styles.faceLarge]}>
          <View style={styles.eyes}>
            <View style={[styles.eye, small && styles.eyeSmall]} />
            <View style={[styles.eye, small && styles.eyeSmall]} />
          </View>
          {!small ? <Text style={styles.smile}>⌣</Text> : null}
        </View>
        {!small ? <View style={styles.antenna}><View style={styles.antennaDot} /></View> : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  orbit: { alignItems: 'center', justifyContent: 'center' },
  orbitLarge: { width: 150, height: 150 },
  orbitSmall: { width: 56, height: 56 },
  head: { alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.9)' },
  headLarge: { width: 104, height: 86, borderRadius: radius.xl },
  headSmall: { width: 46, height: 40, borderRadius: radius.md },
  face: { backgroundColor: colors.night, alignItems: 'center', justifyContent: 'center' },
  faceLarge: { width: 78, height: 52, borderRadius: 22 },
  faceSmall: { width: 34, height: 26, borderRadius: 11 },
  eyes: { flexDirection: 'row', gap: spacing.sm },
  eye: { width: 7, height: 13, borderRadius: radius.pill, backgroundColor: colors.cyan },
  eyeSmall: { width: 4, height: 7 },
  smile: { position: 'absolute', bottom: 4, color: '#99FFF0', fontSize: 14 },
  antenna: { position: 'absolute', top: -19, width: 3, height: 20, backgroundColor: '#A88EFF', borderRadius: radius.pill, alignItems: 'center' },
  antennaDot: { width: 9, height: 9, borderRadius: radius.pill, backgroundColor: colors.cyan, marginTop: -3 },
  star: { position: 'absolute', width: 7, height: 7, borderRadius: radius.pill, backgroundColor: '#A88EFF' },
  starOne: { top: 16, right: 12 },
  starTwo: { bottom: 22, left: 10, backgroundColor: colors.cyan },
});
