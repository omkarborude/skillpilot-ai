import { useSyncExternalStore } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useJourneyStore } from '@/store/journeyStore';

function subscribe(onStoreChange: () => void) {
  const unsubscribeJourneyHydrate = useJourneyStore.persist.onHydrate(onStoreChange);
  const unsubscribeJourneyFinish = useJourneyStore.persist.onFinishHydration(onStoreChange);
  const unsubscribeAuthHydrate = useAuthStore.persist.onHydrate(onStoreChange);
  const unsubscribeAuthFinish = useAuthStore.persist.onFinishHydration(onStoreChange);
  return () => {
    unsubscribeJourneyHydrate();
    unsubscribeJourneyFinish();
    unsubscribeAuthHydrate();
    unsubscribeAuthFinish();
  };
}

function hasHydrated() {
  return useJourneyStore.persist.hasHydrated() && useAuthStore.persist.hasHydrated();
}

export function useStoreHydrated() {
  return useSyncExternalStore(
    subscribe,
    hasHydrated,
    () => true,
  );
}
