import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { signIn, wcaAccessToken } from "./auth";

const AccessTokenContext = createContext<string | null>(null);

export const useAccessToken = (): string | null => {
  return useContext(AccessTokenContext);
};

export const AccessTokenProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = wcaAccessToken();

    if (accessToken) {
      setAccessToken(accessToken);
    } else {
      signIn();
    }
  }, []);

  return (
    <AccessTokenContext.Provider value={accessToken}>
      {children}
    </AccessTokenContext.Provider>
  );
};
