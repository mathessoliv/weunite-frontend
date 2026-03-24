/**
 * Interface padrão para respostas de API
 * Centraliza o formato de resposta usado em todos os serviços
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  error: string | null;
}
