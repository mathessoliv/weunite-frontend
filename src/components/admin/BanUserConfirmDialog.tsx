import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { ShieldBan, AlertTriangle } from "lucide-react";

interface BanUserConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  username: string;
}

/**
 * Dialog de confirmação para banimento permanente de usuário
 */
export function BanUserConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  username,
}: BanUserConfirmDialogProps) {
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = () => {
    if (!reason.trim() || reason.trim().length < 10) {
      return;
    }

    if (confirmText.toUpperCase() !== "BANIR") {
      return;
    }

    onConfirm(reason);
    handleClose();
  };

  const handleClose = () => {
    setReason("");
    setConfirmText("");
    onOpenChange(false);
  };

  const isValid =
    reason.trim().length >= 10 && confirmText.toUpperCase() === "BANIR";

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <ShieldBan className="h-5 w-5" />
            Banir Usuário Permanentemente
          </DialogTitle>
          <DialogDescription>
            Você está prestes a banir{" "}
            <span className="font-semibold text-foreground">@{username}</span>{" "}
            permanentemente
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Aviso de ação irreversível */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="font-semibold text-red-800 dark:text-red-200">
                  ⚠️ Ação Permanente e Irreversível
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 list-disc list-inside">
                  <li>O usuário não poderá mais fazer login na plataforma</li>
                  <li>
                    Todas as denúncias pendentes contra ele serão fechadas
                  </li>
                  <li>A conta permanecerá no banco de dados para auditoria</li>
                  <li>Posts e conteúdos do usuário serão mantidos</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="ban-reason">
              Motivo do Banimento <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ban-reason"
              placeholder="Descreva detalhadamente o motivo do banimento (mínimo 10 caracteres)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 caracteres (mínimo 10)
            </p>
          </div>

          {/* Confirmação por texto */}
          <div className="space-y-2">
            <Label htmlFor="confirm-text">
              Digite <span className="font-mono font-bold">BANIR</span> para
              confirmar <span className="text-destructive">*</span>
            </Label>
            <input
              id="confirm-text"
              type="text"
              placeholder="BANIR"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border rounded-md font-mono uppercase"
            />
          </div>

          {/* Preview */}
          {isValid && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
              <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                ✓ Confirmação válida. O usuário @{username} será banido
                permanentemente.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isValid}
            variant="destructive"
            className="gap-2"
          >
            <ShieldBan className="h-4 w-4" />
            Banir Permanentemente
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
