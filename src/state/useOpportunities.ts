import type {
  CreateOpportunity,
  UpdateOpportunity,
} from "@/@types/opportunity.types";
import {
  createOpportunityRequest,
  deleteOpportunityRequest,
  getOpportunitiesCompanyRequest,
  getOpportunitiesRequest,
  getOpportunitySubscribersRequest,
  toggleSubscriberRequest,
  updateOpportunityRequest,
  checkIsSubscribedRequest,
  getAthleteSubscriptionsRequest,
  toggleSavedOpportunityRequest,
  getSavedOpportunitiesRequest,
  checkIsSavedRequest,
} from "@/api/services/opportunityService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const opportunityKeys = {
  all: ["opportunities"] as const,
  lists: () => [...opportunityKeys.all, "list"] as const,
  list: (filters: string) => [...opportunityKeys.lists(), { filters }] as const,
  details: () => [...opportunityKeys.all, "detail"] as const,
  detail: (id: string) => [...opportunityKeys.details(), id] as const,
  subscribers: (opportunityId: number) =>
    [...opportunityKeys.all, "subscribers", opportunityId] as const,
};

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      companyId,
    }: {
      data: CreateOpportunity;
      companyId: number;
    }) => createOpportunityRequest(data, companyId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Oportunidade criada com sucesso!");

        queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
      } else {
        toast.error(result.message || "Erro ao criar oportunidade");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao criar oportunidade");
    },
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      companyId,
    }: {
      data: UpdateOpportunity;
      companyId: number;
    }) => updateOpportunityRequest(companyId, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Oportunidade atualizada com sucesso!");

        queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
      } else {
        toast.error(result.message || "Erro ao atualizar oportunidade");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao atualizar oportunidade");
    },
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      opportunityId,
      companyId,
    }: {
      opportunityId: number;
      companyId: number;
    }) => deleteOpportunityRequest(companyId, opportunityId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Oportunidade deletada com sucesso!");

        queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
      } else {
        toast.error(result.message || "Erro ao deletar oportunidade");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao deletar oportunidade");
    },
  });
};

export const useGetOpportunitiesCompany = (
  companyId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: opportunityKeys.list(`companyId=${companyId}`),
    queryFn: () => getOpportunitiesCompanyRequest(companyId),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: options?.enabled ?? true,
  });
};

export const useGetOpportunities = () => {
  return useQuery({
    queryKey: opportunityKeys.lists(),
    queryFn: getOpportunitiesRequest,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useGetOpportunitySubscribers = (
  opportunityId: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: opportunityKeys.subscribers(opportunityId),
    queryFn: () => getOpportunitySubscribersRequest(opportunityId),
    enabled,
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
};

export const useToggleSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      athleteId,
      opportunityId,
    }: {
      athleteId: number;
      opportunityId: number;
    }) => toggleSubscriberRequest(athleteId, opportunityId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Candidatura atualizada com sucesso!");

        // Invalida as queries para atualizar a lista de oportunidades e o status de inscrição
        queryClient.invalidateQueries({ queryKey: opportunityKeys.lists() });
        queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
      } else {
        toast.error(result.error || "Erro ao atualizar candidatura");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao atualizar candidatura");
    },
  });
};

export const useCheckIsSubscribed = (
  athleteId: number,
  opportunityId: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [
      ...opportunityKeys.all,
      "isSubscribed",
      athleteId,
      opportunityId,
    ],
    queryFn: () => checkIsSubscribedRequest(athleteId, opportunityId),
    enabled,
    staleTime: 1 * 60 * 1000,
    retry: 2,
  });
};

export const useGetAthleteSubscriptions = (
  athleteId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...opportunityKeys.all, "athleteSubscriptions", athleteId],
    queryFn: () => getAthleteSubscriptionsRequest(athleteId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    enabled: options?.enabled ?? true,
  });
};

// ========================================
// SAVED OPPORTUNITIES HOOKS
// ========================================

export const useToggleSavedOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      athleteId,
      opportunityId,
    }: {
      athleteId: number;
      opportunityId: number;
    }) => toggleSavedOpportunityRequest(athleteId, opportunityId),
    onSuccess: (data, variables) => {
      // Invalida a lista de oportunidades salvas
      queryClient.invalidateQueries({
        queryKey: [...opportunityKeys.all, "savedOpportunities"],
      });
      // Invalida o status de salva para esta oportunidade
      queryClient.invalidateQueries({
        queryKey: [
          ...opportunityKeys.all,
          "isSaved",
          variables.athleteId,
          variables.opportunityId,
        ],
      });
    },
  });
};

export const useGetSavedOpportunities = (
  athleteId: number,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: [...opportunityKeys.all, "savedOpportunities", athleteId],
    queryFn: () => getSavedOpportunitiesRequest(athleteId),
    staleTime: 2 * 60 * 1000,
    retry: 2,
    enabled: options?.enabled ?? true,
  });
};

export const useCheckIsSaved = (
  athleteId: number,
  opportunityId: number,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: [...opportunityKeys.all, "isSaved", athleteId, opportunityId],
    queryFn: () => checkIsSavedRequest(athleteId, opportunityId),
    enabled,
    staleTime: 1 * 60 * 1000,
    retry: 2,
  });
};
