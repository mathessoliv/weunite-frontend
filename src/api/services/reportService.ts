import { instance as axios } from "../axios";
import type { AxiosError } from "axios";
import type { ApiResponse } from "@/types/api.types";

interface CreateReportRequest {
  type: "POST" | "OPPORTUNITY";
  entityId: number;
  reason: string;
}

interface ReportResponse {
  id: string;
  reporter: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  type: string;
  entityId: number;
  reason: string;
  status: string;
  createdAt: string;
}

/**
 * Cria uma denúncia para um post ou oportunidade
 */
export const createReportRequest = async (
  userId: number,
  reportData: CreateReportRequest,
): Promise<ApiResponse<ReportResponse>> => {
  try {
    const response = await axios.post(`/reports/create/${userId}`, reportData);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Denúncia enviada com sucesso",
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao enviar denúncia",
    };
  }
};

/**
 * Busca todas as denúncias pendentes
 */
export const getPendingReportsRequest = async (): Promise<
  ApiResponse<ReportResponse[]>
> => {
  try {
    const response = await axios.get("/reports/pending");

    return {
      success: true,
      data: response.data,
      message: null,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error:
        error.response?.data?.message || "Erro ao carregar denúncias pendentes",
    };
  }
};

/**
 * Busca todas as denúncias (incluindo concluídas)
 */
export const getAllReportsRequest = async (): Promise<
  ApiResponse<ReportResponse[]>
> => {
  try {
    const response = await axios.get("/reports/all");

    return {
      success: true,
      data: response.data,
      message: null,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error: error.response?.data?.message || "Erro ao carregar denúncias",
    };
  }
};

/**
 * Busca denúncias por status
 */
export const getReportsByStatusRequest = async (
  status: string,
): Promise<ApiResponse<ReportResponse[]>> => {
  try {
    const response = await axios.get(`/reports/status/${status}`);

    return {
      success: true,
      data: response.data,
      message: null,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error:
        error.response?.data?.message ||
        "Erro ao carregar denúncias por status",
    };
  }
};

/**
 * Busca a contagem de denúncias de uma entidade
 */
export const getReportCountRequest = async (
  entityId: number,
  type: "POST" | "OPPORTUNITY",
): Promise<ApiResponse<number>> => {
  try {
    const response = await axios.get(`/reports/count/${entityId}/${type}`);

    return {
      success: true,
      data: response.data,
      message: null,
      error: null,
    };
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;

    return {
      success: false,
      data: null,
      message: null,
      error:
        error.response?.data?.message ||
        "Erro ao carregar contagem de denúncias",
    };
  }
};
