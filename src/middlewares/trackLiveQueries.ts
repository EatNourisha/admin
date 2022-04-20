import { useEffect } from "react";
import { Middleware, SWRHook, mutate } from "swr";

const liveQueries = new Set<string>();

const trackLiveQueries: Middleware = (useSWRHook: SWRHook) => {
  return (key, fetcher, config) => {
    const swr = useSWRHook(key, fetcher, config);

    console.log({ liveQueries });

    useEffect(() => {
      liveQueries.add(String(key));

      return () => {
        liveQueries.delete(String(key));
      };
    }, [key]);

    return swr;
  };
};

export async function revalidateLiveQueries() {
  const promises = [...(liveQueries.values() as any)].map((key) => mutate(key));
  return await Promise.all(promises);
}

export default trackLiveQueries;
