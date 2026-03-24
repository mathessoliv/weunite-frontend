import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, Mail, ExternalLink, Loader2 } from "lucide-react";
import { getInitials } from "@/utils/getInitials";
import { useNavigate } from "react-router-dom";
import { useGetOpportunitySubscribers } from "@/state/useOpportunities";
import type { SubscriberDetail } from "@/@types/opportunity.types";

interface OpportunitySubscribersProps {
  opportunityId?: number;
  opportunityTitle?: string;
  subscribers?: SubscriberDetail[];
}

export function OpportunitySubscribers({
  opportunityId,
  subscribers: subscribersProp,
}: OpportunitySubscribersProps) {
  const navigate = useNavigate();

  // Buscar candidatos da oportunidade apenas se não foram passados via props
  const { data: subscribersData, isLoading } = useGetOpportunitySubscribers(
    opportunityId || 0,
    !!opportunityId && !subscribersProp,
  );

  // Usar os subscribers passados via props ou os buscados via API
  const subscribers =
    subscribersProp ||
    (Array.isArray(subscribersData?.data) ? subscribersData.data : []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Carregando candidatos...</p>
      </div>
    );
  }

  if (!subscribers || subscribers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg font-medium">
          Nenhum atleta inscrito ainda
        </p>
        <p className="text-muted-foreground text-sm mt-2">
          Os atletas que se inscreverem nesta oportunidade aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {subscribers.map((subscriber) => {
        const athlete = subscriber.athlete;
        const initials = getInitials(athlete.username || athlete.name);

        return (
          <div
            key={subscriber.id}
            className="w-full max-w-[30em] border rounded-lg p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={athlete.profileImg} alt={athlete.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{athlete.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  @{athlete.username}
                </p>
              </div>
            </div>

            {athlete.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{athlete.email}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => navigate(`/profile/${athlete.username}`)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver Perfil
            </Button>
          </div>
        );
      })}
    </div>
  );
}
