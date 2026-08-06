import { FlashList } from '@shopify/flash-list';
import { Text, View } from 'react-native';
import { screens } from '@/constants/screens';
import { ScreenCard } from '@/components/ScreenCard';
export default function Dashboard() { return <View className="flex-1 bg-slate-50 pt-14 px-4"><Text className="text-3xl font-black mb-1">Good Morning 👋</Text><Text className="text-slate-500 mb-4">35+ polished screens, no voice-coach journey.</Text><FlashList data={screens} estimatedItemSize={230} ItemSeparatorComponent={() => <View className="h-4" />} renderItem={({ item, index }) => <ScreenCard screen={item} index={index} />} /></View>; }
