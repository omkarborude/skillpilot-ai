import { Text, View } from 'react-native';
import { Input, Button, Card } from '@/components/ui';
export default function Goals() { return <View className="flex-1 bg-slate-50 justify-center p-6"><Card><View className="gap-4"><Text className="text-3xl font-black">What's your goal?</Text><Text className="text-slate-500">This helps Nova create the perfect roadmap for you.</Text><Input placeholder="Describe a skill or hobby" /><Button>Build Roadmap</Button></View></Card></View>; }
