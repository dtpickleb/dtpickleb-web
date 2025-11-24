"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { loadPlayerProfile } from "@/app/features/registration/playerProfileSlice";
import { isAuthedClient } from "@/lib/auth-cookies";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    // Fetch player profile if user is authenticated
    if (!initialized.current && isAuthedClient()) {
      initialized.current = true;
      store.dispatch(loadPlayerProfile());
      // TODO: Re-enable this after backend caching is implemented
      // store.dispatch(fetchAllEnums());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
