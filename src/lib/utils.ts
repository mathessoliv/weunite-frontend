import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata uma data para o formato brasileiro legível
 * @param dateString - Data em formato ISO 8601 ou timestamp
 * @returns Formato: "11 de novembro de 2025 às 17:30"
 */
export function formatDateBR(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Sao_Paulo",
  };

  return date.toLocaleDateString("pt-BR", options).replace(" de ", " de ");
}

/**
 * Formata uma data para o formato brasileiro com apenas data (sem hora)
 * @param dateString - Data em formato ISO 8601 ou timestamp
 * @returns Formato: "11 de novembro de 2025"
 */
export function formatDateBRShort(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  };

  return date.toLocaleDateString("pt-BR", options).replace(" de ", " de ");
}
