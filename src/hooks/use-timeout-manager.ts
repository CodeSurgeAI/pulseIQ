'use client';

import { useCallback, useEffect, useRef } from 'react';

type TimeoutId = number;

/**
 * Centralises timeout management so components do not leak handlers
 * when they unmount before a scheduled callback runs.
 */
export function useTimeoutManager() {
  const timeoutsRef = useRef<TimeoutId[]>([]);

  const removeId = useCallback((timeoutId: TimeoutId) => {
    timeoutsRef.current = timeoutsRef.current.filter((id) => id !== timeoutId);
  }, []);

  const scheduleTimeout = useCallback(
    (callback: () => void, delay: number) => {
      const timeoutId = window.setTimeout(() => {
        try {
          callback();
        } finally {
          removeId(timeoutId);
        }
      }, delay);

      timeoutsRef.current.push(timeoutId);
      return timeoutId;
    },
    [removeId]
  );

  const clearManagedTimeout = useCallback((timeoutId: TimeoutId) => {
    window.clearTimeout(timeoutId);
    removeId(timeoutId);
  }, [removeId]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutsRef.current = [];
  }, []);

  useEffect(() => clearAllTimeouts, [clearAllTimeouts]);

  return {
    scheduleTimeout,
    clearManagedTimeout,
    clearAllTimeouts,
  };
}
