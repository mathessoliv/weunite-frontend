import { useState, useEffect } from "react";

const FIRST_LOGIN_KEY = "weunite_has_seen_intro";

export const useFirstLogin = () => {
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem(FIRST_LOGIN_KEY);

    if (hasSeenIntro === null) {
      setIsFirstLogin(true);
    } else {
      setIsFirstLogin(false);
    }

    setIsLoading(false);
  }, []);

  const markIntroAsSeen = () => {
    localStorage.setItem(FIRST_LOGIN_KEY, "true");
    setIsFirstLogin(false);
  };

  const resetFirstLogin = () => {
    localStorage.removeItem(FIRST_LOGIN_KEY);
    setIsFirstLogin(true);
  };

  return {
    isFirstLogin,
    isLoading,
    markIntroAsSeen,
    resetFirstLogin,
  };
};
