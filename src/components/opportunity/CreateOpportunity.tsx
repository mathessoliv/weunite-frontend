import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { createOpportunitySchema } from "@/schemas/opportunity/createOpportunity.schema";
import { useCreateOpportunity } from "@/state/useOpportunities";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, ChevronDownIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateSkill from "./skill/CreateSkill";
import { SelectedSkills } from "./skill/SelectedSkills";
import { toast } from "sonner";

interface CreateOpportunityProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateOpportunity({
  open,
  onOpenChange,
}: CreateOpportunityProps) {
  const form = useForm<z.infer<typeof createOpportunitySchema>>({
    resolver: zodResolver(createOpportunitySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      dateEnd: new Date(),
      skills: [],
    },
  });

  const { user } = useAuthStore();

  const createOpportunityMutation = useCreateOpportunity();

  async function onSubmit(values: z.infer<typeof createOpportunitySchema>) {
    if (!user?.id) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      const result = await createOpportunityMutation.mutateAsync({
        data: {
          ...values,
          skills: values.skills.map((skillName, index) => ({
            id: index + 1,
            name: skillName,
          })),
        },
        companyId: Number(user.id),
      });

      if (result.success) {
        form.reset();
        onOpenChange?.(false);
        toast.success("Oportunidade criada com sucesso!");
      } else {
        toast.error(result.error || "Erro ao criar oportunidade");
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar oportunidade");
      console.error("Erro ao criar oportunidade:", error);
    }
  }

  const isSubmitting = createOpportunityMutation.isPending;

  // Observar o campo description para o contador
  const descriptionValue = form.watch("description") || "";
  const descriptionLength = descriptionValue.length;
  const descriptionMinLength = 10;
  const descriptionMaxLength = 500;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[90vw] max-w-[40em] max-h-[90vh] overflow-y-auto p-4"
        aria-describedby={undefined}
      >
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg">Criar Oportunidade</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-2 text-sm"
        >
          <div className="grid gap-1">
            <Label htmlFor="opportunity-title" className="text-xs font-medium">
              Título <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="opportunity-title"
                    placeholder="Ex: Oportunidade para lateral esquerdo"
                    className={cn(
                      "min-h-[50px] resize-none text-sm",
                      fieldState.error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...field}
                  />
                  {fieldState.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{fieldState.error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-1">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="opportunity-description"
                className="text-xs font-medium"
              >
                Descrição <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "text-xs",
                  descriptionLength < descriptionMinLength
                    ? "text-destructive"
                    : descriptionLength > descriptionMaxLength
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {descriptionLength}/{descriptionMaxLength} caracteres
                {descriptionLength < descriptionMinLength &&
                  ` (mínimo: ${descriptionMinLength})`}
              </span>
            </div>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    id="opportunity-description"
                    placeholder="Descreva a oportunidade... (mínimo 10 caracteres)"
                    className={cn(
                      "min-h-[80px] resize-none text-sm",
                      fieldState.error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...field}
                  />
                  {fieldState.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{fieldState.error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-1">
            <Label
              htmlFor="opportunity-location"
              className="text-xs font-medium"
            >
              Localização <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    id="opportunity-location"
                    placeholder="Ex: São Paulo, SP"
                    className={cn(
                      "h-8 text-sm",
                      fieldState.error &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...field}
                  />
                  {fieldState.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{fieldState.error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-1">
            <Label
              htmlFor="opportunity-dateEnd"
              className="text-xs font-medium"
            >
              Data limite <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="dateEnd"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between text-left font-normal h-8 text-sm",
                          !field.value && "text-muted-foreground",
                          fieldState.error &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      >
                        <div className="flex items-center">
                          <CalendarIcon className="mr-2 h-3 w-3" />
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: ptBR })
                          ) : (
                            <span>Selecionar data</span>
                          )}
                        </div>
                        <ChevronDownIcon className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        fixedWeeks={true}
                        initialFocus
                        locale={ptBR}
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {fieldState.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{fieldState.error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="opportunity-skills" className="text-xs font-medium">
              Habilidades <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="skills"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <CreateSkill
                    selectedSkills={field.value}
                    onSkillsChange={field.onChange}
                  />
                  {field.value.length > 0 && (
                    <SelectedSkills
                      skills={field.value}
                      showRemove={true}
                      onRemoveSkill={(skill) => {
                        const newSkills = field.value.filter(
                          (s) => s !== skill,
                        );
                        field.onChange(newSkills);
                      }}
                      className="mt-2"
                    />
                  )}
                  {fieldState.error && (
                    <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                      <AlertCircle className="h-3 w-3" />
                      <span>{fieldState.error.message}</span>
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <DialogFooter className="mt-4 flex-col-reverse sm:flex-row gap-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-8 text-sm hover:cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-8 text-sm variant-third bg-third hover:bg-third-hover"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
