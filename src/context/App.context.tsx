import * as React from "react";
import { createContext, ReactNode, useState } from "react";

export type AppContextType = {
  usingTab: number;
  setUsingTab: React.Dispatch<React.SetStateAction<number>>;
};

export const AppContext = createContext<AppContextType>({
  usingTab: 1,
  setUsingTab: () => {},
});

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [usingTab, setUsingTab] = useState(1);
  return (
    <AppContext.Provider value={{ usingTab, setUsingTab }}>
      {children}
    </AppContext.Provider>
  );
};
