import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "@/contexts/OnboardingContext";
import type { DriveStep } from "driver.js";

export const OnboardingTour = () => {
  const { isTourActive, driverObj, stopTour } = useOnboarding();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTourActive && driverObj) {
      const steps: DriveStep[] = [
        // Passo 1: Home
        {
          element: "body",
          popover: {
            title: "🏠 Bem-vindo ao WeUnite!",
            description: "Esta é sua página inicial com o feed de publicações.",
            side: "top",
            align: "center",
            showButtons: ["next", "close"],
            nextBtnText: "Próximo →",
            onNextClick: () => {
              driverObj.destroy();
              navigate("/opportunity");
              setTimeout(() => {
                driverObj.drive(1);
              }, 600);
            },
          },
        },
        // Passo 2: Oportunidades
        {
          element: "body",
          popover: {
            title: "🎯 Oportunidades",
            description: "Explore vagas em times e eventos esportivos!",
            side: "top",
            align: "center",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
            onNextClick: () => {
              driverObj.destroy();
              navigate("/chat");
              setTimeout(() => {
                driverObj.drive(2);
              }, 200);
            },
            onPrevClick: () => {
              driverObj.destroy();
              navigate("/home");
              setTimeout(() => {
                driverObj.drive(0);
              }, 600);
            },
          },
        },
        // Passo 3: Chat
        {
          element: "body",
          popover: {
            title: "💬 Mensagens",
            description: "Converse em tempo real com a comunidade!",
            side: "top",
            align: "center",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
            onNextClick: () => {
              driverObj.destroy();
              navigate("/home");
              setTimeout(() => {
                driverObj.drive(3);
              }, 600);
            },
            onPrevClick: () => {
              driverObj.destroy();
              navigate("/opportunity");
              setTimeout(() => {
                driverObj.drive(1);
              }, 600);
            },
          },
        },
        // Passo 4: Botão Home
        {
          element: '[data-tour="home"]',
          popover: {
            title: "🏠 Navegação",
            description: "Use este botão para voltar à home.",
            side: "bottom",
            align: "start",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
            onPrevClick: () => {
              driverObj.destroy();
              navigate("/chat");
              setTimeout(() => {
                driverObj.drive(2);
              }, 200);
            },
          },
        },
        // Passo 5: Notificações
        {
          element: '[data-tour="notifications"]',
          popover: {
            title: "🔔 Notificações",
            description: "Veja curtidas, comentários e oportunidades!",
            side: "bottom",
            align: "start",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
          },
        },
        // Passo 6: Criar Post
        {
          element: '[data-tour="create-post"]',
          popover: {
            title: "✍️ Criar Publicação",
            description: "Compartilhe seus momentos!",
            side: "left",
            align: "start",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
          },
        },
        // Passo 7: Perfil
        {
          element: '[data-tour="profile"]',
          popover: {
            title: "👤 Perfil",
            description: "Acesse seu perfil aqui!",
            side: "top",
            align: "start",
            nextBtnText: "Próximo →",
            prevBtnText: "← Anterior",
          },
        },
        // Passo 8: Finalização
        {
          popover: {
            title: "🎉 Pronto!",
            description: "Agora você conhece o WeUnite!",
            doneBtnText: "Concluir ✓",
            prevBtnText: "← Anterior",
          },
        },
      ];

      driverObj.setConfig({
        onDestroyStarted: () => {
          navigate("/home");
          stopTour();
        },
      });

      driverObj.setSteps(steps);
      driverObj.drive();
    }
  }, [isTourActive, driverObj, stopTour, navigate]);

  return null;
};
