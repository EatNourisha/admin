import React, { useCallback, useEffect } from "react";

import Router from "Router";
import useAuthStore from "stores/auth";
import ls from "utils/secureStorage";

import configs from "config";

function App() {
  const { hydrate, dehydrate } = useAuthStore();

  const isSignedIn = useCallback(() => {
    const auth = ls.get(configs.authKey);
    return auth?.isSignedIn && auth?.token;
  }, []);

  const authExpired = useCallback(() => {
    const auth = ls.get(configs.authKey);
    return auth?.isSignedIn && auth?.token && new Date().getTime() > auth?.exp;
  }, []);

  useEffect(() => {
    if (authExpired()) {
      dehydrate();
    }

    if (isSignedIn()) {
      hydrate();
    }
  }, [dehydrate, hydrate, authExpired, isSignedIn]);

  return <Router />;
}

export default App;
