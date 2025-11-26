import {
  RulerDimensionLine,
  Footprints,
  MapPin,
  Weight,
  User as UserIcon,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Badge } from "../ui/badge";
import type { User } from "@/@types/user.types";

interface AboutProfileProps {
  user?: User | null;
}

export default function AboutProfile({ user }: AboutProfileProps) {
  return (
    <Card className="w-[30em] sm:w-[38em] md:w-[42.5em]">
      <CardHeader className="items-start">
        <CardTitle className="text-lg">Sobre</CardTitle>
        <CardDescription className="gap-2">
          Faça uma breve descrição sobre você, suas preferências e sua jornada
          atual.
        </CardDescription>
        <span>{user?.bio || "Sem descrição disponível."}</span>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-4">
        <div className="w-full">
          <div className="text-lg font-semibold mb-2">Características</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Idade:</span>
              <span className="text-sm mt-[0.1em]">25</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Posição:</span>
              <span className="text-sm mt-[0.1em]">Atacante</span>
            </div>
            <div className="flex items-center gap-2">
              <Footprints className="h-4 w-4" />
              <span>Perna Dominante:</span>
              <span className="text-sm mt-[0.1em]">Direita</span>
            </div>
            <div className="flex items-center gap-2">
              <RulerDimensionLine className="h-4 w-4" />
              <span>Altura:</span>
              <span className="text-sm mt-[0.1em]">180cm</span>
            </div>
            <div className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              <span>Peso:</span>
              <span className="text-sm mt-[0.1em]">90kg</span>
            </div>
          </div>
        </div>

        {user?.skills && user.skills.length > 0 && (
          <div className="w-full">
            <div className="text-lg font-semibold mb-2">Habilidades</div>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, index) => {
                const skillName =
                  typeof skill === "string" ? skill : skill.name;
                const skillId = typeof skill === "string" ? index : skill.id;
                return (
                  <Badge key={skillId} variant="secondary">
                    {skillName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
