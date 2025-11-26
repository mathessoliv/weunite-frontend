import {
  User,
  RulerDimensionLine,
  Footprints,
  MapPin,
  Weight,
  Calendar,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import {
  Card,
  CardTitle,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import type { User as UserType } from "@/@types/user.types";

interface AboutProfileProps {
  user?: UserType | null;
}

export default function AboutProfile({ user }: AboutProfileProps) {
  const isCompany = user?.role === "COMPANY" || user?.role === "company";

  // Dados mockados para demonstração - em produção viriam do backend
  const companyData = {
    description:
      "Clube centenário fundado por imigrantes, com rica história no futebol brasileiro e mundial. Reconhecido internacionalmente por sua torcida apaixonada e títulos conquistados.",
    foundedYear: "1930",
    location: "São Paulo, SP - Brasil",
    phone: "(11) 3749-8000",
    email: "contato@saopaulofc.net",
    website: "www.saopaulofc.net",
  };

  const athleteData = {
    description:
      "Faça uma breve descrição sobre você, suas preferências e sua jornada atual.",
    userDescription: "Fale mais sobre você. Isto seria uma descrição.",
    age: "25",
    position: "Atacante",
    dominantFoot: "Direita",
    height: "180cm",
    weight: "90kg",
  };

  if (isCompany) {
    return (
      <Card className="w-[30em] sm:w-[38em] md:w-[42.5em]">
        <CardHeader className="items-start">
          <CardTitle className="text-lg">Sobre o Clube</CardTitle>
          <CardDescription className="gap-2">
            {companyData.description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex-col items-start gap-3">
          <div className="text-lg font-semibold mb-2">Informações</div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">Fundado em:</span>
            <span className="text-sm mt-[0.1em]">
              {companyData.foundedYear}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Localização:</span>
            <span className="text-sm mt-[0.1em]">{companyData.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span className="font-medium">Telefone:</span>
            <span className="text-sm mt-[0.1em]">{companyData.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span className="font-medium">Email:</span>
            <span className="text-sm mt-[0.1em]">{companyData.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="font-medium">Website:</span>
            <span className="text-sm mt-[0.1em]">{companyData.website}</span>
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Perfil de Atleta
  return (
    <Card className="w-[30em] sm:w-[38em] md:w-[42.5em]">
      <CardHeader className="items-start">
        <CardTitle className="text-lg">Sobre</CardTitle>
        <CardDescription className="gap-2">
          {athleteData.description}
        </CardDescription>
        <span>{athleteData.userDescription}</span>
      </CardHeader>

      <CardFooter className="flex-col items-start">
        <div className="text-lg font-semibold mb-2">Características</div>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="font-medium">Idade:</span>
          <span className="text-sm mt-[0.1em]">{athleteData.age}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium">Posição:</span>
          <span className="text-sm mt-[0.1em]">{athleteData.position}</span>
        </div>
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          <span className="font-medium">Perna Dominante:</span>
          <span className="text-sm mt-[0.1em]">{athleteData.dominantFoot}</span>
        </div>
        <div className="flex items-center gap-2">
          <RulerDimensionLine className="h-4 w-4 text-primary" />
          <span className="font-medium">Altura:</span>
          <span className="text-sm mt-[0.1em]">{athleteData.height}</span>
        </div>
        <div className="flex items-center gap-2">
          <Weight className="h-4 w-4 text-primary" />
          <span className="font-medium">Peso:</span>
          <span className="text-sm mt-[0.1em]">{athleteData.weight}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
