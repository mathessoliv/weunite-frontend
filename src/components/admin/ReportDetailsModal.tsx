import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  XCircle,
  AlertTriangle,
  User,
  ShieldAlert,
  ShieldBan,
} from "lucide-react";
import type { Report } from "@/@types/admin.types";
import { toast } from "sonner";
import {
  markReportsAsReviewedRequest,
  dismissReportsRequest,
  banUserRequest,
  suspendUserRequest,
} from "@/api/services/adminService";
import { useState } from "react";
import { getReportReasonText } from "@/utils/adminBadges";
import { SuspendUserDialog } from "./SuspendUserDialog";
import { BanUserConfirmDialog } from "./BanUserConfirmDialog";

interface ReportDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
  onActionComplete?: () => void;
}

/**
 * Modal de detalhes de denúncia para administradores
 */
export function ReportDetailsModal({
  isOpen,
  onOpenChange,
  report,
  onActionComplete,
}: ReportDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);

  if (!report) return null;

  // TODO: Pegar o admin ID do contexto de autenticação
  const adminId = 1; // Temporário - substituir por ID real do admin logado

  const handleSuspendUser = async (durationInDays: number, reason: string) => {
    const reportedUserWithId = report.reportedUser as any;
    const userId = reportedUserWithId.id;

    if (!userId) {
      toast.error("Não foi possível identificar o ID do usuário denunciado");
      return;
    }

    setIsLoading(true);

    const response = await suspendUserRequest({
      userId: Number(userId),
      adminId,
      durationInDays,
      reason,
      reportId: parseInt(report.id),
    });

    setIsLoading(false);

    if (response.success) {
      toast.success(response.message || "Usuário suspenso com sucesso!");
      onOpenChange(false);
      onActionComplete?.();
    } else {
      toast.error(response.error || "Erro ao suspender usuário");
    }
  };

  const handleBanUser = async (reason: string) => {
    const reportedUserWithId = report.reportedUser as any;
    const userId = reportedUserWithId.id;

    if (!userId) {
      toast.error("Não foi possível identificar o ID do usuário denunciado");
      return;
    }

    setIsLoading(true);

    const response = await banUserRequest({
      userId: Number(userId),
      adminId,
      reason,
      reportId: parseInt(report.id),
    });

    setIsLoading(false);

    if (response.success) {
      toast.success(response.message || "Usuário banido com sucesso!");
      onOpenChange(false);
      onActionComplete?.();
    } else {
      toast.error(response.error || "Erro ao banir usuário");
    }
  };

  const handleReject = async () => {
    setIsLoading(true);

    const entityId = report.entityId;
    const type = report.entityType;

    const response = await dismissReportsRequest(entityId, type);

    setIsLoading(false);

    if (response.success) {
      toast.success(response.message || "Denúncia rejeitada com sucesso!");
      onOpenChange(false);
      onActionComplete?.();
    } else {
      toast.error(response.error || "Erro ao rejeitar denúncia");
    }
  };

  const handleAnalyze = async () => {
    setIsLoading(true);

    const entityId = report.entityId;
    const type = report.entityType;

    const response = await markReportsAsReviewedRequest(entityId, type);

    setIsLoading(false);

    if (response.success) {
      toast.success(response.message || "Denúncia marcada como em análise!");
      onOpenChange(false);
      onActionComplete?.();
    } else {
      toast.error(response.error || "Erro ao marcar denúncia como em análise");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto scrollbar-thumb">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl">Detalhes da Denúncia</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Revise as informações e tome as ações necessárias
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações da Denúncia */}
          <div className="grid grid-cols-2 gap-4">
            {/* Denunciante */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Denunciante
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reportedBy.username}`}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.reportedBy.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{report.reportedBy.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Denunciado */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">
                Denunciado
              </h4>
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${report.reportedUser.username}`}
                  />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{report.reportedUser.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{report.reportedUser.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Motivo e Descrição */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Motivo</h4>
              <Badge variant="outline" className="text-sm">
                {getReportReasonText(report.reason)}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Descrição</h4>
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-sm">{report.description}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Conteúdo Reportado</h4>
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
                {report.content && (
                  <p className="text-sm text-muted-foreground">
                    {report.content}
                  </p>
                )}
                {report.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={report.imageUrl}
                      alt="Conteúdo do post"
                      className="w-full h-auto object-cover max-h-96"
                    />
                  </div>
                )}
                {!report.content && !report.imageUrl && (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum conteúdo disponível
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informações Adicionais */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Data:</span>
              <span className="ml-2 font-medium">
                {new Date(report.createdAt).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">ID:</span>
              <span className="ml-2 font-mono text-xs">#{report.id}</span>
            </div>
          </div>

          <Separator />

          {/* Ações */}
          <div>
            <h4 className="text-sm font-medium mb-3">Ações de Moderação</h4>
            <div className="space-y-2">
              {/* Marcar como em análise */}
              {report.status === "pending" && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950/20"
                  onClick={handleAnalyze}
                  disabled={isLoading}
                >
                  <AlertTriangle className="h-4 w-4" />
                  {isLoading ? "Processando..." : "Marcar como Em Análise"}
                </Button>
              )}

              {/* Rejeitar denúncia (denúncia falsa) */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-gray-50 hover:text-gray-600 hover:border-gray-200 dark:hover:bg-gray-950/20"
                onClick={handleReject}
                disabled={isLoading}
              >
                <XCircle className="h-4 w-4" />
                {isLoading ? "Processando..." : "Rejeitar Denúncia (Falsa)"}
              </Button>

              <div className="my-2 border-t pt-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Ações com punição ao usuário:
                </p>
              </div>

              {/* Suspender usuário */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 dark:hover:bg-orange-950/20"
                onClick={() => setIsSuspendDialogOpen(true)}
                disabled={isLoading}
              >
                <ShieldAlert className="h-4 w-4" />
                {isLoading
                  ? "Processando..."
                  : "Suspender Usuário (Temporário)"}
              </Button>

              {/* Banir usuário */}
              <Button
                variant="outline"
                className="w-full justify-start gap-2 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-950/20"
                onClick={() => setIsBanDialogOpen(true)}
                disabled={isLoading}
              >
                <ShieldBan className="h-4 w-4" />
                {isLoading ? "Processando..." : "Banir Usuário (Permanente)"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Dialogs de confirmação */}
      <SuspendUserDialog
        isOpen={isSuspendDialogOpen}
        onOpenChange={setIsSuspendDialogOpen}
        onConfirm={handleSuspendUser}
        username={report.reportedUser.username}
      />

      <BanUserConfirmDialog
        isOpen={isBanDialogOpen}
        onOpenChange={setIsBanDialogOpen}
        onConfirm={handleBanUser}
        username={report.reportedUser.username}
      />
    </Dialog>
  );
}
