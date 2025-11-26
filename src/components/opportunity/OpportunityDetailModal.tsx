import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Opportunity } from "@/@types/opportunity.types";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Briefcase, Tag } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile?: boolean;
}

export default function OpportunityDetailModal({
  opportunity,
  isOpen,
  onOpenChange,
  isMobile = false,
}: OpportunityDetailModalProps) {
  const navigate = useNavigate();

  const handleGoToOpportunity = () => {
    onOpenChange(false);
    navigate(`/opportunity`);
  };

  const OpportunityContent = () => (
    <div className="space-y-5 sm:space-y-6">
      {/* Título e Empresa */}
      <div className="space-y-3 pb-4 border-b">
        <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
          {opportunity.title}
        </h3>
        {opportunity.company && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Briefcase className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">
              {opportunity.company.name}
            </span>
          </div>
        )}
      </div>

      {/* Informações principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {opportunity.location && (
          <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground mb-1 font-medium">
                Localização
              </p>
              <p className="text-sm font-semibold text-foreground truncate">
                {opportunity.location}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
          <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-1 font-medium">
              Data Limite
            </p>
            <p className="text-sm font-semibold text-foreground">
              {format(new Date(opportunity.dateEnd), "dd 'de' MMMM 'de' yyyy", {
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Descrição */}
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          Descrição da Oportunidade
        </h4>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
          {opportunity.description}
        </p>
      </div>

      {/* Habilidades */}
      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Habilidades Requeridas</span>
          </h4>
          <div className="flex flex-wrap gap-2">
            {opportunity.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-1.5 sm:py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-xs sm:text-sm font-medium transition-colors"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botão de ação */}
      <div className="pt-2 sm:pt-4">
        <Button
          onClick={handleGoToOpportunity}
          className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold"
          size="lg"
        >
          Ir para Oportunidade
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[92vh] sm:h-[90vh] px-4 sm:px-6"
        >
          <SheetHeader className="text-left mb-4 sm:mb-6 pb-4 border-b">
            <SheetTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Detalhes da Oportunidade
            </SheetTitle>
            <SheetDescription className="text-sm sm:text-base text-muted-foreground mt-2">
              Veja todas as informações sobre esta oportunidade
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto max-h-[calc(92vh-160px)] sm:max-h-[calc(90vh-160px)] pr-2">
            <OpportunityContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-foreground">
            Detalhes da Oportunidade
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground mt-2">
            Veja todas as informações sobre esta oportunidade
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
          <OpportunityContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
