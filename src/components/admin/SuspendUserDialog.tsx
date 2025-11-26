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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Clock } from "lucide-react";

interface SuspendUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (durationInDays: number, reason: string) => void;
  username: string;
}

const PRESET_DURATIONS = [
  { label: "1 dia", value: 1 },
  { label: "3 dias", value: 3 },
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
];

/**
 * Dialog para suspender um usuário com seleção de duração
 */
export function SuspendUserDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  username,
}: SuspendUserDialogProps) {
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [customDuration, setCustomDuration] = useState("");
  const [reason, setReason] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const handleConfirm = () => {
    const duration = isCustom
      ? parseInt(customDuration)
      : selectedDuration || 1;

    if (!duration || duration < 1) {
      return;
    }

    if (!reason.trim() || reason.trim().length < 10) {
      return;
    }

    onConfirm(duration, reason);
    handleClose();
  };

  const handleClose = () => {
    setSelectedDuration(null);
    setCustomDuration("");
    setReason("");
    setIsCustom(false);
    onOpenChange(false);
  };

  const isValid =
    reason.trim().length >= 10 &&
    ((isCustom && parseInt(customDuration) > 0) ||
      (!isCustom && selectedDuration !== null));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Suspender Usuário Temporariamente
          </DialogTitle>
          <DialogDescription>
            Escolha a duração da suspensão para{" "}
            <span className="font-semibold text-foreground">@{username}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Duração - Opções predefinidas */}
          <div className="space-y-2">
            <Label>Duração da Suspensão</Label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_DURATIONS.map((duration) => (
                <Button
                  key={duration.value}
                  variant={
                    !isCustom && selectedDuration === duration.value
                      ? "default"
                      : "outline"
                  }
                  className="justify-start"
                  onClick={() => {
                    setIsCustom(false);
                    setSelectedDuration(duration.value);
                    setCustomDuration("");
                  }}
                >
                  {duration.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Duração personalizada */}
          <div className="space-y-2">
            <Label htmlFor="custom-duration">
              Ou defina um período personalizado
            </Label>
            <div className="flex gap-2">
              <Input
                id="custom-duration"
                type="number"
                min="1"
                placeholder="Ex: 15"
                value={customDuration}
                onChange={(e) => {
                  setCustomDuration(e.target.value);
                  if (e.target.value) {
                    setIsCustom(true);
                    setSelectedDuration(null);
                  }
                }}
              />
              <span className="flex items-center text-sm text-muted-foreground">
                dias
              </span>
            </div>
          </div>

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason">
              Motivo da Suspensão <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo da suspensão (mínimo 10 caracteres)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500 caracteres (mínimo 10)
            </p>
          </div>

          {/* Preview */}
          {isValid && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/20">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                <strong>Resumo:</strong> O usuário @{username} será suspenso por{" "}
                <strong>
                  {isCustom ? customDuration : selectedDuration} dia(s)
                </strong>{" "}
                e não poderá fazer login durante este período.
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
            className="bg-orange-600 hover:bg-orange-700"
          >
            Confirmar Suspensão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
