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
      <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Detalhes da Denúncia
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Revise as informações e escolha a ação apropriada
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p className="text-xs text-muted-foreground">ID: #{report.id}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Layout em 3 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_300px] gap-6 py-6 overflow-y-auto flex-1">
          {/* COLUNA 1: Perfis */}
          <div className="space-y-4">
            {/* Denunciado */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <h4 className="text-sm font-bold  dark:text-red-400 uppercase tracking-wide">
                  Denunciado
                </h4>
              </div>
              <div className="rounded-lg border-2 bg-red-500/60 p-4">
                <div className="flex items-start gap-3 ">
                  <Avatar className="h-14 w-14 ring-2 shrink-0 bg-red-500/60">
                    <AvatarImage src={report.reportedUser.profileImg} />
                    <AvatarFallback className="bg-red-500/60 text-white">
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-base truncate">
                      {report.reportedUser.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      @{report.reportedUser.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Denunciante */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Denunciante
              </h4>
              <div className="rounded-lg border-2 border-border bg-card p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 ring-2 ring-border shrink-0">
                    <AvatarImage src={report.reportedBy.profileImg} />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-base truncate">
                      {report.reportedBy.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      @{report.reportedBy.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA 2: Conteúdo */}
          <div className="space-y-4 min-w-0 lg:border-x lg:px-6">
            {/* Motivo */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Motivo da Denúncia
              </h4>
              <Badge variant="destructive" className="text-sm px-3 py-1.5">
                {getReportReasonText(report.reason)}
              </Badge>
            </div>

            {/* Descrição */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Descrição da Denúncia
              </h4>
              <div className="rounded-lg border-2 border-border bg-muted/40 p-4">
                <p className="text-sm leading-relaxed">{report.description}</p>
              </div>
            </div>

            {/* Conteúdo Denunciado */}
            <div>
              <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">
                Conteúdo Denunciado
              </h4>
              <div className="rounded-lg border-2 bg-muted/40 p-4 space-y-4">
                {report.content && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {report.content}
                  </p>
                )}
                {report.imageUrl && (
                  <div className="rounded-lg overflow-hidden border-2 border-border shadow-md">
                    <img
                      src={report.imageUrl}
                      alt="Conteúdo denunciado"
                      className="w-full h-auto object-contain max-h-[450px]"
                    />
                  </div>
                )}
                {!report.content && !report.imageUrl && (
                  <p className="text-sm text-muted-foreground italic text-center py-8">
                    Nenhum conteúdo disponível
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* COLUNA 3: Ações */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <ShieldBan className="h-5 w-5 text-orange-600" />
              <h4 className="text-sm font-bold uppercase tracking-wide">
                Ações
              </h4>
            </div>

            {/* Marcar como em análise */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-11 text-sm font-semibold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-400 dark:hover:bg-blue-950/40 transition-all"
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              <AlertTriangle className="h-4 w-4" />
              {isLoading ? "Processando..." : "Em Análise"}
            </Button>

            {/* Rejeitar denúncia */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-11 text-sm font-semibold hover:bg-green-50 hover:text-green-700 hover:border-green-400 dark:hover:bg-green-950/40 transition-all"
              onClick={handleReject}
              disabled={isLoading}
            >
              <XCircle className="h-4 w-4" />
              {isLoading ? "Processando..." : "Rejeitar Denúncia (Falsa)"}
            </Button>

            <div className="my-3 border-t-2 border-dashed pt-3">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">
                  Com Punição
                </p>
              </div>
            </div>

            {/* Suspender usuário */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-11 text-sm font-semibold hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-400 dark:hover:bg-yellow-950/40 transition-all"
              onClick={() => setIsSuspendDialogOpen(true)}
              disabled={isLoading}
            >
              <ShieldAlert className="h-4 w-4" />
              {isLoading ? "Processando..." : "Suspender"}
            </Button>

            {/* Banir usuário */}
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 h-11 text-sm font-semibold hover:bg-red-50 hover:text-red-700 hover:border-red-400 dark:hover:bg-red-950/40 transition-all"
              onClick={() => setIsBanDialogOpen(true)}
              disabled={isLoading}
            >
              <ShieldBan className="h-4 w-4" />
              {isLoading ? "Processando..." : "Banir"}
            </Button>

            <div className="mt-6 pt-4 border-t">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <strong>💡 Lembrete:</strong> Ações de suspensão e banimento são
                irreversíveis. Analise cuidadosamente.
              </p>
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
