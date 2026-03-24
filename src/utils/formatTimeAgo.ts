import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Menos de 1 minuto
  if (diffInSeconds < 60) {
    return "agora";
  }

  // Menos de 1 hora
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}min`;
  }

  // Menos de 24 horas
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  }

  // Menos de 7 dias
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  }

  // Menos de 30 dias
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks}sem`;
  }

  // Usa o formatDistanceToNow para períodos maiores
  return formatDistanceToNow(dateObj, {
    addSuffix: false,
    locale: ptBR,
  })
    .replace("cerca de ", "")
    .replace(" meses", "m")
    .replace(" mês", "m")
    .replace(" anos", "a")
    .replace(" ano", "a");
};
