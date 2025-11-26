import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api.types";
import { instance as axios } from "@/api/axios";

/**
 * Serviço de Users - Moderação de Usuários
 *
 * Responsável por:
 * - Banir usuários permanentemente
 * - Suspender usuários temporariamente
 */

/**
 * Interface para request de banimento
 */
export interface BanUserRequest {
  userId: number;
  adminId: number;
  reason: string;
  reportId?: number;
}

/**
 * Interface para request de suspensão
 */
export interface SuspendUserRequest {
  userId: number;
  adminId: number;
  durationInDays: number;
  reason: string;
  reportId?: number;
}

/**
 * Bane um usuário permanentemente
 */
export const banUserRequest = async (
  request: BanUserRequest,
): Promise<ApiResponse<string>> => {
  try {
    const response = await axios.post("/admin/users/ban", request);

    return {
      success: true,
      data: response.data.data || response.data.message,
      message: response.data.message || "Usuário banido com sucesso",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao banir usuário",
    };
  }
};

/**
 * Suspende um usuário temporariamente
 */
export const suspendUserRequest = async (
  request: SuspendUserRequest,
): Promise<ApiResponse<string>> => {
  try {
    const response = await axios.post("/admin/users/suspend", request);

    return {
      success: true,
      data: response.data.data || response.data.message,
      message: response.data.message || "Usuário suspenso com sucesso",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao suspender usuário",
    };
  }
};
