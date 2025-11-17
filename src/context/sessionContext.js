'use client'
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../../utils/supabase/client";

export const SessionContext = createContext(null);

export function SessionProvider ({children}) {
    const [session, setSession] = useState(null);
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session)
    };
    getSession();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);
  return (
    <SessionContext.Provider value = {{ session, setSession }}>
        {children}
    </SessionContext.Provider>
  )
}