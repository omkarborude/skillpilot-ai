import { useSyncExternalStore } from 'react';
import { useJourneyStore } from '@/store/journeyStore';

function subscribe(onStoreChange: () => void) {
  const unsubscribeHydrate = useJourneyStore.persist.onHydrate(onStoreChange);
  const unsubscribeFinish = useJourneyStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubscribeHydrate();
    unsubscribeFinish();
  };
}

export function useStoreHydrated() {
  return useSyncExternalStore(
    subscribe,
    useJourneyStore.persist.hasHydrated,
    () => true,
  );
}
