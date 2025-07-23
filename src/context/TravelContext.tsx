import React, { createContext, useContext, useState, ReactNode } from "react";

type Coordenadas = { latitude: number; longitude: number } | null;

type MotoristaLocationContextType = {
  location: Coordenadas;
  setLocation: (loc: Coordenadas) => void;
};

const MotoristaLocationContext = createContext<MotoristaLocationContextType | undefined>(undefined);

export const MotoristaLocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<Coordenadas>(null);

  return (
    <MotoristaLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </MotoristaLocationContext.Provider>
  );
};

export function useMotoristaLocation() {
  const context = useContext(MotoristaLocationContext);
  if (!context) throw new Error("useMotoristaLocation must be used within a MotoristaLocationProvider");
  return context;
}
