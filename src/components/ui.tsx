import { PropsWithChildren } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/theme/tokens';

export function Button({ children }: PropsWithChildren) { return <Pressable className="rounded-2xl overflow-hidden"><LinearGradient colors={[colors.primaryLight, colors.primary]} className="px-5 py-4"><Text className="text-center text-white font-bold">{children}</Text></LinearGradient></Pressable>; }
export function Card({ children }: PropsWithChildren) { return <View className="bg-white border border-pilot-100 rounded-3xl p-4 shadow-sm">{children}</View>; }
export function Badge({ children }: PropsWithChildren) { return <View className="self-start rounded-full bg-pilot-100 px-3 py-1"><Text className="text-pilot-600 text-xs font-bold">{children}</Text></View>; }
export function Input({ placeholder }: { placeholder: string }) { return <TextInput placeholder={placeholder} className="bg-white border border-pilot-100 rounded-2xl px-4 py-3" />; }
export function Avatar() { return <View className="h-20 w-20 rounded-full bg-pilot-100 items-center justify-center"><Text className="text-3xl">🤖</Text></View>; }
export function ProgressBar({ value }: { value: number }) { return <View className="h-3 rounded-full bg-pilot-100 overflow-hidden"><View style={{ width: `${value}%` }} className="h-full rounded-full bg-pilot-600" /></View>; }
export function Skeleton() { return <View className="h-20 rounded-3xl bg-pilot-100 opacity-60" />; }
export function EmptyState() { return <Card><View className="items-center gap-3"><Avatar /><Text className="font-bold text-lg">No lessons here yet!</Text><Text className="text-slate-500 text-center">Create your first AI-powered learning journey.</Text><Button>Create Journey</Button></View></Card>; }
export function RoadmapNode({ label, progress }: { label: string; progress: number }) { return <Card><View className="flex-row items-center gap-3"><Badge>{progress}%</Badge><Text className="font-semibold flex-1">{label}</Text></View></Card>; }
export function AiMessage({ text }: { text: string }) { return <View className="rounded-3xl bg-pilot-600 p-4"><Text className="text-white">{text}</Text></View>; }
export function Chart() { return <Svg height="90" width="100%" viewBox="0 0 320 90"><Circle cx="270" cy="28" r="18" fill="#ede9fe"/><Path d="M8 70 C 60 10, 100 80, 150 35 S 240 80, 312 22" stroke={colors.primary} strokeWidth="8" fill="none" strokeLinecap="round"/></Svg>; }
