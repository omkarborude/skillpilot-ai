import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV({ id: 'skillpilot' });
export const tokenStorage = { get: () => storage.getString('auth.token'), set: (token: string) => storage.set('auth.token', token), clear: () => storage.delete('auth.token') };
