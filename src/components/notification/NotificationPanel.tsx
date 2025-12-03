import { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { NotificationList } from "./NotificationList";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NotificationFilter =
  | "all"
  | "likes"
  | "comments"
  | "follows"
  | "messages";

export function NotificationPanel({
  isOpen = false,
  onOpenChange,
}: {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  useEffect(() => {
    if (onOpenChange) {
      setOpen(isOpen);
    }

    if (isOpen || (!onOpenChange && open)) {
      setShouldRender(true);
      setIsAnimating(false);
      // ✅ REMOVIDO: invalidateQueries daqui
      // WebSocket já cuida de invalidar quando recebe notificação
    } else {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onOpenChange, open]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const isCurrentlyOpen = onOpenChange ? isOpen : open;
  if (!shouldRender) return null;

  return (
    <>
      <div
        className={`fixed top-0 bottom-0 z-40 pointer-events-auto bg-card border-r border-border shadow-lg ${
          isAnimating
            ? "animate-out slide-out-to-left"
            : "animate-in slide-in-from-left"
        } duration-500`}
        style={{
          left: "4.5rem",
          width: "400px",
        }}
        onAnimationEnd={() => {
          if (isAnimating && !isCurrentlyOpen) {
            setShouldRender(false);
          }
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Notificações</h2>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="text-xs">
                      {filter === "all"
                        ? "Todas"
                        : filter === "likes"
                          ? "Curtidas"
                          : filter === "comments"
                            ? "Comentários"
                            : filter === "follows"
                              ? "Seguidores"
                              : "Mensagens"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilter("all")}>
                    Todas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("likes")}>
                    Curtidas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("comments")}>
                    Comentários
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("follows")}>
                    Seguidores
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("messages")}>
                    Mensagens
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <button
                onClick={() => handleOpenChange(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Fechar notificações"
              >
                <X className="h-5 w-5 hover:cursor-pointer" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <NotificationList filter={filter} />
          </div>
        </div>
      </div>
    </>
  );
}
