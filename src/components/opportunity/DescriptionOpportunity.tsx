import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Opportunity } from "@/@types/opportunity.types";
import { X as CloseIcon, MapPin, Calendar, Users } from "lucide-react";
import { useBreakpoints } from "@/hooks/useBreakpoints";
import {
  Dialog,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { getInitials } from "@/utils/getInitials";
import { getTimeAgo } from "@/hooks/useGetTimeAgo";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  useToggleSubscriber,
  useCheckIsSubscribed,
} from "@/state/useOpportunities";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface OpportunityDescriptionProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  opportunity: Opportunity;
}

export function OpportunityDescription({
  isOpen,
  onOpenChange,
  opportunity,
}: OpportunityDescriptionProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const companyInitials = getInitials(opportunity.company?.name || "");
  const { commentDesktop } = useBreakpoints();
  const toggleSubscriber = useToggleSubscriber();

  const isOwner = opportunity.company?.id === user?.id;
  const isAthlete = user?.role === "ATHLETE";

  // Verificar se está inscrito (somente para atletas que não são donos)
  const { data: isSubscribedData } = useCheckIsSubscribed(
    Number(user?.id),
    Number(opportunity.id),
    isAthlete && !isOwner,
  );
  const isSubscribed = isSubscribedData?.data || false;

  const opportunityDate = new Date(opportunity.dateEnd).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
  );

  // Determina se a oportunidade já expirou (compara apenas a data, sem horário)
  const isExpired = (() => {
    try {
      if (!opportunity.dateEnd) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const deadline = new Date(opportunity.dateEnd);
      deadline.setHours(0, 0, 0, 0);
      return deadline < today;
    } catch (e) {
      return false;
    }
  })();

  const subscribersCount = opportunity.subscribersCount || 0;

  const handleApply = () => {
    if (!user?.id || !isAthlete || toggleSubscriber.isPending) return;

    if (isExpired) {
      toast.error(
        "Não é possível candidatar-se: prazo da oportunidade expirou.",
      );
      return;
    }

    toggleSubscriber.mutate({
      athleteId: Number(user.id),
      opportunityId: Number(opportunity.id),
    });
  };

  if (!commentDesktop) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[100vh] data-[vaul-drawer-direction=bottom]:max-h-[100vh] mt-0 flex flex-col">
          <DrawerHeader className="pt-4 px-6 flex-shrink-0">
            <DrawerClose className="absolute rounded-sm transition-opacity right-4">
              <CloseIcon className="h-5 w-5 hover:cursor-pointer" />
            </DrawerClose>
            <DrawerTitle>Detalhes da Oportunidade</DrawerTitle>
            <DrawerDescription>
              Veja todos os detalhes e candidate-se a esta oportunidade
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col w-full items-center overflow-y-auto px-4 py-6">
            {/* Cabeçalho da oportunidade */}
            <div className="w-full max-w-[45em] mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={opportunity.company?.profileImg} />
                  <AvatarFallback>{companyInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{opportunity.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {opportunity.company?.name} • Publicado há{" "}
                    {getTimeAgo(opportunity.createdAt)}
                  </p>
                </div>
              </div>

              {/* Informações básicas */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {opportunity.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {opportunityDate}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {subscribersCount}{" "}
                  {subscribersCount === 1 ? "candidato" : "candidatos"}
                </div>
              </div>

              {/* Habilidades */}
              <div className="flex flex-wrap gap-2 mb-6">
                {opportunity.skills?.map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
              </div>

              {/* Descrição */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="whitespace-pre-wrap">{opportunity.description}</p>
              </div>

              {/* Botão de candidatura - apenas para atletas */}
              {!isOwner && isAthlete && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={handleApply}
                    className="w-full bg-third hover:bg-third/90"
                    disabled={toggleSubscriber.isPending || isExpired}
                    title={
                      isExpired ? "Prazo da oportunidade expirou" : undefined
                    }
                  >
                    {toggleSubscriber.isPending
                      ? "Processando..."
                      : isSubscribed
                        ? "Cancelar candidatura"
                        : "Candidatar-se"}
                  </Button>
                </div>
              )}

              {/* Botão ver candidaturas - apenas para dono da oportunidade */}
              {isOwner && (
                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={() => {
                      navigate(`/opportunity/${opportunity.id}/subscribers`);
                      onOpenChange?.(false);
                    }}
                    className="w-full border-third text-third hover:bg-third hover:text-white"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Ver candidaturas ({subscribersCount})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] p-0 rounded-xl overflow-hidden">
        <DialogDescription className="sr-only">
          Veja todos os detalhes e candidate-se a esta oportunidade
        </DialogDescription>
        <div className="flex w-full h-full">
          <div className="w-full flex flex-col">
            {/* Cabeçalho */}
            <div className="p-6 border-b flex gap-3 bg-card">
              <Avatar className="h-12 w-12">
                <AvatarImage src={opportunity.company?.profileImg} />
                <AvatarFallback>{companyInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">{opportunity.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {opportunity.company?.name} • Publicado há{" "}
                  {getTimeAgo(opportunity.createdAt)}
                </p>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {/* Informações básicas */}
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{opportunityDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {subscribersCount}{" "}
                    {subscribersCount === 1 ? "candidato" : "candidatos"}
                  </span>
                </div>
              </div>

              {/* Habilidades */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Habilidades necessárias
                </h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.skills?.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Descrição</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">
                    {opportunity.description}
                  </p>
                </div>
              </div>

              {/* Botão de candidatura - apenas para atletas */}
              {user?.role === "ATHLETE" && (
                <div className="border-t pt-4">
                  <Button
                    onClick={handleApply}
                    className="w-full bg-third hover:bg-third/90"
                    disabled={toggleSubscriber.isPending || isExpired}
                    title={
                      isExpired ? "Prazo da oportunidade expirou" : undefined
                    }
                  >
                    {toggleSubscriber.isPending
                      ? "Processando..."
                      : isSubscribed
                        ? "Cancelar candidatura"
                        : "Candidatar-se"}
                  </Button>
                </div>
              )}

              {/* Botão ver candidaturas - apenas para dono da oportunidade */}
              {isOwner && (
                <div className="border-t pt-4">
                  <Button
                    onClick={() => {
                      navigate(`/opportunity/${opportunity.id}/subscribers`);
                      onOpenChange?.(false);
                    }}
                    className="w-full border-third text-third hover:bg-third hover:text-white"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Ver candidaturas ({subscribersCount})
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
