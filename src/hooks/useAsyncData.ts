import { useCallback, useEffect, useRef, useState } from "react";
import { notification } from "antd";

type AsyncDataNotice = {
  message: string;
  description: string;
};

type UseAsyncDataOptions<T> = {
  /** Value exposed before the first successful load. */
  initialData: T;
  /** Notification shown when the fetch fails. */
  error: AsyncDataNotice;
  /** Hold the fetch until this turns true. Defaults to `true`. */
  enabled?: boolean;
};

type UseAsyncDataResult<T> = {
  data: T;
  isLoading: boolean;
  hasError: boolean;
  reload: () => void;
};

/**
 * Loads data on mount and exposes a `reload` for refresh buttons.
 *
 * Requests are aborted when the component unmounts or when a newer request
 * starts, so a slow response can never overwrite fresher data or update state
 * after teardown. Fetchers are expected to throw on failure — see `api/f1.ts`.
 */
export const useAsyncData = <T>(
  // eslint-disable-next-line no-unused-vars -- parameter name in a function type
  fetcher: (signal: AbortSignal) => Promise<T>,
  { initialData, error, enabled = true }: UseAsyncDataOptions<T>,
): UseAsyncDataResult<T> => {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [hasError, setHasError] = useState<boolean>(false);

  // Held in refs so `load` stays stable even though callers pass inline
  // fetchers and message objects that change identity on every render.
  const fetcherRef = useRef(fetcher);
  const errorRef = useRef(error);
  useEffect(() => {
    fetcherRef.current = fetcher;
    errorRef.current = error;
  });

  const controllerRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setHasError(false);

    try {
      const result = await fetcherRef.current(controller.signal);
      if (controller.signal.aborted) {
        return;
      }
      setData(result);
      setIsLoading(false);
    } catch {
      if (controller.signal.aborted) {
        return;
      }
      setHasError(true);
      setIsLoading(false);
      notification.error({
        ...errorRef.current,
        placement: "bottomRight",
      });
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    load();

    return () => controllerRef.current?.abort();
  }, [enabled, load]);

  return { data, isLoading, hasError, reload: load };
};
