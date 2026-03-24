import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { Building2, UserCheck, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HorizontalMenuOpportunity() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="flex flex-row w-full pt-[0.4em] z-30 gap-2 pointer-events-auto justify-end pr-1 overflow-x-auto">
        {user?.role === "COMPANY" && (
          <Button
            variant="outline"
            onClick={() => navigate("/opportunity/my-opportunities")}
            className="flex-shrink-0 min-w-[14em] justify-center text-xs h-[2em] bg-gradient-to-r from-third to-green-500 hover:from-green-500 hover:to-emerald-500 text-white shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Building2 className="h-4 w-4 text-white" />
            <span className="font-medium">Minhas Oportunidades</span>
          </Button>
        )}

        {user?.role === "ATHLETE" && (
          <>
            <Button
              onClick={() => navigate("/opportunity/my-opportunities")}
              className="flex-shrink-0 min-w-[14em] justify-center text-xs h-[2.5em] bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <UserCheck className="h-4 w-4 text-white" />
              <span className="font-medium">Minhas Candidaturas</span>
            </Button>

            <Button
              onClick={() => navigate("/opportunity/saved")}
              className="flex-shrink-0 min-w-[14em] justify-center text-xs h-[2.5em] bg-green-700 hover:bg-green-800 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Bookmark className="h-4 w-4 text-white" />
              <span className="font-medium">Oportunidades Salvas</span>
            </Button>
          </>
        )}
      </div>
    </>
  );
}
