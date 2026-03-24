import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Briefcase,
  MapPin,
  Calendar,
  Users,
  EyeOff,
  Trash2,
} from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { getTimeAgo } from "@/hooks/useGetTimeAgo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOpportunityByAdminRequest } from "@/api/services/adminService";
import { toast } from "sonner";

interface OpportunityData {
  id: string;
  title: string;
  description: string;
  location: string;
  dateEnd: string;
  skills: any[];
  createdAt: string;
  company: {
    id: string;
    name: string;
    username: string;
    profileImg?: string;
  };
}

interface OpportunityReviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity: OpportunityData | null;
}

/**
 * Modal de revisão de denúncia de oportunidades para administradores
 */
export function OpportunityReviewModal({
  isOpen,
  onOpenChange,
  opportunity,
}: OpportunityReviewModalProps) {
  const queryClient = useQueryClient();

  if (!opportunity) return null;

  const initials = getInitials(opportunity.company.name);

  const deleteOpportunityMutation = useMutation({
    mutationFn: (opportunityId: string) =>
      deleteOpportunityByAdminRequest(Number(opportunityId)),
    onSuccess: () => {
      toast.success("Oportunidade deletada com sucesso");
      queryClient.invalidateQueries({ queryKey: ["reported-opportunities"] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Erro ao deletar oportunidade:", error);
      toast.error("Erro ao deletar oportunidade");
    },
  });

  const handleDeleteOpportunity = () => {
    const confirmed = window.confirm(
      "Tem certeza que deseja deletar esta oportunidade? Esta ação não pode ser desfeita.",
    );

    if (!confirmed) return;

    deleteOpportunityMutation.mutate(opportunity.id.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">
            Detalhes da Oportunidade
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Revise as informações e tome ações de moderação
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações da Empresa */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={opportunity.company.profileImg} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{opportunity.company.name}</h3>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-600 border-green-500/20"
                >
                  Ativo
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {getTimeAgo(opportunity.createdAt)}
              </p>
            </div>
          </div>

          {/* Título da Oportunidade */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Título da Vaga</h4>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{opportunity.title}</h3>
              </div>
            </div>
          </div>

          {/* Descrição da Oportunidade */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Descrição</h4>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Localização</h4>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{opportunity.location}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Prazo de Inscrição</h4>
              <div className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(opportunity.dateEnd).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Habilidades Requeridas */}
          {opportunity.skills && opportunity.skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Habilidades Requeridas</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.skills.map((skill: any, index: number) => (
                  <Badge key={index} variant="secondary">
                    {typeof skill === "string" ? skill : skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Métricas de Engajamento */}
          <div>
            <h4 className="text-sm font-medium mb-3">
              Métricas de Engajamento
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card">
                <Users className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-2xl font-bold">0</p>
                <p className="text-xs text-muted-foreground">Candidaturas</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card">
                <Briefcase className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-2xl font-bold">
                  {opportunity.skills?.length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Skills</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-border bg-card">
                <Calendar className="h-5 w-5 text-orange-500 mb-2" />
                <p className="text-2xl font-bold">
                  {Math.ceil(
                    (new Date(opportunity.dateEnd).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Dias restantes</p>
              </div>
            </div>
          </div>

          {/* Ações de Moderação */}
          <div>
            <h4 className="text-sm font-medium mb-3">Ações de Moderação</h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 dark:hover:bg-orange-950/20"
                disabled
              >
                <EyeOff className="h-4 w-4" />
                Ocultar Oportunidade (Em breve)
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950/20"
                onClick={handleDeleteOpportunity}
                disabled={deleteOpportunityMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
                {deleteOpportunityMutation.isPending
                  ? "Deletando..."
                  : "Deletar Oportunidade"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
