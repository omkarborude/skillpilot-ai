import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import type { StateStorage } from 'zustand/middleware';

const DATABASE_NAME = 'skillpilot';
const STORE_NAME = 'app-state';

function canUseIndexedDb() {
  return Platform.OS === 'web' && typeof indexedDB !== 'undefined';
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open local storage'));
  });
}

async function indexedDbRequest<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = action(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error('Unable to access local storage'));
    });
  } finally {
    database.close();
  }
}

export const deviceStorage: StateStorage = {
  async getItem(name) {
    if (!canUseIndexedDb()) return AsyncStorage.getItem(name);
    return (await indexedDbRequest('readonly', (store) => store.get(name))) ?? null;
  },
  async setItem(name, value) {
    if (!canUseIndexedDb()) return AsyncStorage.setItem(name, value);
    await indexedDbRequest('readwrite', (store) => store.put(value, name));
  },
  async removeItem(name) {
    if (!canUseIndexedDb()) return AsyncStorage.removeItem(name);
    await indexedDbRequest('readwrite', (store) => store.delete(name));
  },
};
