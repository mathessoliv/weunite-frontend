import {
  getReportedPostsDetailsRequest,
  getReportedPostDetailRequest,
  deletePostByAdminRequest,
  getReportedOpportunitiesDetailsRequest,
  getReportedOpportunityDetailRequest,
  deleteOpportunityByAdminRequest,
  dismissReportsRequest,
  markReportsAsReviewedRequest,
  resolveReportsRequest,
} from "@/api/services/admin/reports";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Query keys para cache de reports
 */
export const reportKeys = {
  all: ["reports"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  posts: () => [...reportKeys.lists(), "posts"] as const,
  opportunities: () => [...reportKeys.lists(), "opportunities"] as const,
  postDetail: (id: number) => [...reportKeys.posts(), id] as const,
  opportunityDetail: (id: number) =>
    [...reportKeys.opportunities(), id] as const,
};

/**
 * Hook para buscar posts denunciados
 */
export const useReportedPosts = () => {
  return useQuery({
    queryKey: reportKeys.posts(),
    queryFn: () => getReportedPostsDetailsRequest(),
    select: (response) => (response.success ? response.data : []),
  });
};

/**
 * Hook para buscar um post denunciado específico
 */
export const useReportedPostDetail = (postId: number) => {
  return useQuery({
    queryKey: reportKeys.postDetail(postId),
    queryFn: () => getReportedPostDetailRequest(postId),
    select: (response) => (response.success ? response.data : null),
  });
};

/**
 * Hook para buscar oportunidades denunciadas
 */
export const useReportedOpportunities = () => {
  return useQuery({
    queryKey: reportKeys.opportunities(),
    queryFn: () => getReportedOpportunitiesDetailsRequest(),
    select: (response) => (response.success ? response.data : []),
  });
};

/**
 * Hook para buscar uma oportunidade denunciada específica
 */
export const useReportedOpportunityDetail = (opportunityId: number) => {
  return useQuery({
    queryKey: reportKeys.opportunityDetail(opportunityId),
    queryFn: () => getReportedOpportunityDetailRequest(opportunityId),
    select: (response) => (response.success ? response.data : null),
  });
};

/**
 * Hook para deletar um post denunciado
 */
export const useDeleteReportedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => deletePostByAdminRequest(postId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Post deletado com sucesso!");

        queryClient.invalidateQueries({ queryKey: reportKeys.posts() });
      } else {
        toast.error(result.message || "Erro ao deletar post");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao deletar post");
    },
  });
};

/**
 * Hook para deletar uma oportunidade denunciada
 */
export const useDeleteReportedOpportunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityId: number) =>
      deleteOpportunityByAdminRequest(opportunityId),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Oportunidade deletada com sucesso!");

        queryClient.invalidateQueries({ queryKey: reportKeys.opportunities() });
      } else {
        toast.error(result.message || "Erro ao deletar oportunidade");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao deletar oportunidade");
    },
  });
};

/**
 * Hook para descartar denúncias
 */
export const useDismissReports = (type: "POST" | "OPPORTUNITY") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityId: number) => dismissReportsRequest(entityId, type),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Denúncias descartadas com sucesso!");

        const queryKey =
          type === "POST" ? reportKeys.posts() : reportKeys.opportunities();
        queryClient.invalidateQueries({ queryKey });
      } else {
        toast.error(result.message || "Erro ao descartar denúncias");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao descartar denúncias");
    },
  });
};

/**
 * Hook para marcar denúncias como revisadas
 */
export const useMarkReportsAsReviewed = (type: "POST" | "OPPORTUNITY") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityId: number) =>
      markReportsAsReviewedRequest(entityId, type),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Denúncias marcadas como revisadas!");

        const queryKey =
          type === "POST" ? reportKeys.posts() : reportKeys.opportunities();
        queryClient.invalidateQueries({ queryKey });
      } else {
        toast.error(result.message || "Erro ao marcar como revisadas");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao marcar como revisadas");
    },
  });
};

/**
 * Hook para resolver denúncias
 */
export const useResolveReports = (type: "POST" | "OPPORTUNITY") => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityId: number) => resolveReportsRequest(entityId, type),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Denúncias resolvidas com sucesso!");

        const queryKey =
          type === "POST" ? reportKeys.posts() : reportKeys.opportunities();
        queryClient.invalidateQueries({ queryKey });
      } else {
        toast.error(result.message || "Erro ao resolver denúncias");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao resolver denúncias");
    },
  });
};
