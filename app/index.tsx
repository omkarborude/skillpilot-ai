import { Link } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card } from '@/components/ui';
export default function Splash() { return <LinearGradient colors={['#120A3D', '#25105F']} className="flex-1"><View className="flex-1 justify-center p-6 gap-6"><Text className="text-white text-5xl font-black">SkillPilot AI</Text><Text className="text-violet-100 text-lg">Your personal AI coach to master any hobby.</Text><Link href="/(tabs)/dashboard" asChild><Button>Get Started</Button></Link><Link href="/onboarding/goals" className="text-center text-violet-200">Explore Demo</Link></View></LinearGradient>; }
