import {
  banUserRequest,
  suspendUserRequest,
  type BanUserRequest,
  type SuspendUserRequest,
} from "@/api/services/admin/users";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook para banir um usuário permanentemente
 */
export const useBanUser = () => {
  return useMutation({
    mutationFn: (request: BanUserRequest) => banUserRequest(request),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Usuário banido com sucesso!");
      } else {
        toast.error(result.message || "Erro ao banir usuário");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao banir usuário");
    },
  });
};

/**
 * Hook para suspender um usuário temporariamente
 */
export const useSuspendUser = () => {
  return useMutation({
    mutationFn: (request: SuspendUserRequest) => suspendUserRequest(request),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Usuário suspenso com sucesso!");
      } else {
        toast.error(result.message || "Erro ao suspender usuário");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao suspender usuário");
    },
  });
};
