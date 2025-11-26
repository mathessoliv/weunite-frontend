import { Ruler, Footprints, Target, Weight, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import type { User } from "@/@types/user.types";
import { differenceInYears, parseISO } from "date-fns";
import { Separator } from "../ui/separator";

interface AboutProfileProps {
  user?: User | null;
}

export default function AboutProfile({ user }: AboutProfileProps) {
  const age = user?.birthDate
    ? differenceInYears(new Date(), parseISO(user.birthDate))
    : null;

  const isAthlete = user?.role?.toUpperCase() === "ATHLETE";

  return (
    <Card className="w-full max-w-3xl border-none shadow-none bg-transparent sm:bg-card sm:border sm:shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">
          Sobre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground leading-relaxed">
          {user?.bio || "Nenhuma descrição informada."}
        </div>

        {isAthlete && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Características
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <CharacteristicItem
                  icon={<Calendar className="w-4 h-4" />}
                  label="Idade"
                  value={age ? `${age} anos` : "N/A"}
                />
                <CharacteristicItem
                  icon={<Target className="w-4 h-4" />}
                  label="Posição"
                  value={user?.position || "N/A"}
                />
                <CharacteristicItem
                  icon={<Footprints className="w-4 h-4" />}
                  label="Pé Dominante"
                  value={user?.footDomain || "N/A"}
                />
                <CharacteristicItem
                  icon={<Ruler className="w-4 h-4" />}
                  label="Altura"
                  value={user?.height ? `${user.height}m` : "N/A"}
                />
                <CharacteristicItem
                  icon={<Weight className="w-4 h-4" />}
                  label="Peso"
                  value={user?.weight ? `${user.weight}kg` : "N/A"}
                />
              </div>
            </div>
          </>
        )}

        {user?.skills && user.skills.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground">
                Habilidades
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, index) => {
                  const skillName =
                    typeof skill === "string" ? skill : skill.name;
                  const skillId = typeof skill === "string" ? index : skill.id;
                  return (
                    <Badge
                      key={skillId}
                      variant="secondary"
                      className="px-3 py-1 text-xs font-normal bg-secondary/50 hover:bg-secondary/70 transition-colors"
                    >
                      {skillName}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function CharacteristicItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/40">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  );
}
