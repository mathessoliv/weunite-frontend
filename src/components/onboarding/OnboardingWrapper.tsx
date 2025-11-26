import { useEffect, useState } from "react";
import { useFirstLogin } from "@/hooks/useFirstLogin";
import { useOnboarding } from "@/contexts/OnboardingContext";
import { useAuthStore } from "@/stores/useAuthStore";
import { useLocation } from "react-router-dom";
import { FirstLoginModal } from "./FirstLoginModal";
import { OnboardingTour } from "./OnBoardingTour";

export const OnboardingWrapper = () => {
  const { isFirstLogin, markIntroAsSeen } = useFirstLogin();
  const { startTour } = useOnboarding();
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isAuthPage = location.pathname.startsWith("/auth");

    if (isFirstLogin && isAuthenticated && user && !isAuthPage) {
      setShowModal(true);
    }
  }, [isFirstLogin, isAuthenticated, user, location.pathname]);

  const handleKnowsApp = () => {
    setShowModal(false);
    markIntroAsSeen();
  };

  const handleStartTutorial = () => {
    setShowModal(false);
    markIntroAsSeen();
    startTour();
  };

  return (
    <>
      {/* Modal de primeiro login */}
      <FirstLoginModal
        isOpen={showModal}
        onKnowsApp={handleKnowsApp}
        onStartTutorial={handleStartTutorial}
      />

      {/* Componente do tutorial (ativa quando startTour() é chamado) */}
      <OnboardingTour />
    </>
  );
};
