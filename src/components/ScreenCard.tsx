import { Text, View } from 'react-native';
import { SkillScreen } from '@/types/domain';
import { Avatar, Badge, Button, Card, Chart, ProgressBar } from './ui';
export function ScreenCard({ screen, index }: { screen: SkillScreen; index: number }) {
 return <Card><View className="gap-3"><View className="flex-row items-center justify-between"><Badge>{String(index + 1).padStart(2, '0')}</Badge><Text className="text-xs text-slate-500">{screen.category}</Text></View><View className="items-center"><Avatar /></View><Text className="text-xl font-extrabold text-slate-950">{screen.title}</Text><Text className="text-slate-500 leading-5">{screen.description}</Text>{screen.category === 'Profile' ? <Chart /> : <ProgressBar value={screen.category === 'Roadmap' ? 43 : 72} />}<Button>{screen.cta}</Button></View></Card>;
}
