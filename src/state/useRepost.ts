import type { ToggleRepost } from "@/@types/repost.types";
import { repostPostRequest } from "@/api/services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "./usePosts";
import { toast } from "sonner";

export const useToggleRepost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleRepost) => repostPostRequest(data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success(result.message || "Post republicado com sucesso!");

        queryClient.invalidateQueries({ queryKey: postKeys.lists() });
      } else {
        toast.error(result.error || "Erro ao republicar post");
      }
    },
    onError: () => {
      toast.error("Erro inesperado ao republicar post");
    },
  });
};
