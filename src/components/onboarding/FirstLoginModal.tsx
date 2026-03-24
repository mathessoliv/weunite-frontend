import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FirstLoginModalProps {
  isOpen: boolean;
  onKnowsApp: () => void;
  onStartTutorial: () => void;
}

export const FirstLoginModal = ({
  isOpen,
  onKnowsApp,
  onStartTutorial,
}: FirstLoginModalProps) => {
  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Bem-vindo ao WeUnite! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            Já conhece o WeUnite?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={onKnowsApp}
            variant="default"
            size="lg"
            className="w-full"
          >
            Sim, já conheço
          </Button>

          <Button
            onClick={onStartTutorial}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Não conheço, me apresente
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Esta mensagem aparece apenas no seu primeiro acesso
        </p>
      </DialogContent>
    </Dialog>
  );
};
