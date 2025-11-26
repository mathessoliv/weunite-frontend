import { createContext, useContext, useState, type ReactNode } from "react";
import { driver, type Driver } from "driver.js";
import "driver.js/dist/driver.css";
import "../styles/driver-theme.css";

interface OnboardingContextType {
  isTourActive: boolean;
  startTour: () => void;
  stopTour: () => void;
  driverObj: Driver | null;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider = ({ children }: OnboardingProviderProps) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [driverObj] = useState<Driver | null>(() => {
    // Inicializa o Driver.js
    return driver({
      showProgress: true,
      showButtons: ["next", "previous", "close"],
      progressText: "{{current}} de {{total}}",
      onDestroyStarted: () => {
        setIsTourActive(false);
      },
    });
  });

  const startTour = () => {
    setIsTourActive(true);
  };

  const stopTour = () => {
    setIsTourActive(false);
    driverObj?.destroy();
  };

  return (
    <OnboardingContext.Provider
      value={{
        isTourActive,
        startTour,
        stopTour,
        driverObj,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);

  if (context === null) {
    throw new Error(
      "useOnboarding deve ser usado dentro de OnboardingProvider",
    );
  }

  return context;
};
