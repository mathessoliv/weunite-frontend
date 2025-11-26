import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/state/useUsers";
import {
  updateProfileSchema,
  type UpdateProfileForm,
} from "@/schemas/updateProfile.schema";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import CreateSkill from "../opportunity/skill/CreateSkill";
import { SelectedSkills } from "../opportunity/skill/SelectedSkills";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Separator } from "@/components/ui/separator";

interface EditProfileProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export default function EditProfile({
  isOpen,
  onOpenChange,
}: EditProfileProps) {
  const { user } = useAuthStore();
  const [preview, setPreview] = useState<string | null>(null);

  const editProfile = useUpdateProfile();

  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      username: user?.username,
      bio: user?.bio || "",
      media: null,
      skills:
        user?.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [],
      height: user?.height,
      weight: user?.weight,
      footDomain: user?.footDomain,
      position: user?.position,
      birthDate: user?.birthDate,
    },
  });

  useEffect(() => {
    if (isOpen && user) {
      form.reset({
        name: user.name,
        username: user.username,
        bio: user.bio || "",
        media: null,
        skills:
          user.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [],
        height: user.height,
        weight: user.weight,
        footDomain: user.footDomain,
        position: user.position,
        birthDate: user.birthDate,
      });
      setPreview(user.profileImg ?? null);
    }
  }, [isOpen, user, form]);

  const handleFile = (file?: File | null) => {
    if (!file) {
      form.setValue("media", null);
      return;
    }
    form.setValue("media", file);
    const url = URL.createObjectURL(file);
    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  async function onSubmit(values: UpdateProfileForm) {
    if (!user?.id) return;

    const skillsToSend =
      values.skills?.map((skillName, index) => ({
        id: index + 1,
        name: skillName,
      })) || [];

    const result = await editProfile.mutateAsync({
      data: {
        name: values.name.trim(),
        username: values.username.trim(),
        bio: values.bio?.trim(),
        profileImg: values?.media || undefined,
        skills: skillsToSend,
        height: values.height,
        weight: values.weight,
        footDomain: values.footDomain,
        position: values.position,
        birthDate: values.birthDate,
      },
      username: user.username,
    });

    if (result.success) {
      form.reset({ ...values, media: null });

      onOpenChange?.(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[30em] md:max-w-[40em] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias no seu perfil.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-3 justify-center">
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              handleFile(file);
                              field.onChange(file);
                            }}
                          />
                          <label
                            htmlFor="avatar-upload"
                            className="relative group cursor-pointer"
                          >
                            <Avatar className="w-28 h-28 rounded-full">
                              <AvatarImage
                                src={
                                  preview ||
                                  user?.profileImg ||
                                  "/placeholder.png"
                                }
                                alt="Foto de perfil"
                                className="object-cover"
                              />
                              <AvatarFallback className="text-xl">
                                {user?.name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white font-medium transition-opacity">
                              Alterar
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor="name">Nome</FormLabel>
                    <FormControl>
                      <Input id="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormControl>
                      <Input id="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="grid gap-3">
                    <FormLabel htmlFor="bio">Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        id="bio"
                        placeholder="Conte um pouco sobre você..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {user?.role?.toUpperCase() === "ATHLETE" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mt-2">
                    <Separator className="flex-1" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Informações do Atleta
                    </span>
                    <Separator className="flex-1" />
                  </div>

                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Habilidades</label>
                    <Controller
                      name="skills"
                      control={form.control}
                      render={({ field }) => (
                        <>
                          <CreateSkill
                            selectedSkills={field.value || []}
                            onSkillsChange={field.onChange}
                          />
                          {(field.value?.length || 0) > 0 && (
                            <SelectedSkills
                              skills={field.value || []}
                              showRemove={true}
                              onRemoveSkill={(skillToRemove) => {
                                const currentSkills = field.value || [];
                                field.onChange(
                                  currentSkills.filter(
                                    (s) => s !== skillToRemove,
                                  ),
                                );
                              }}
                              className="mt-2"
                            />
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (m)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="1.75"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="70.5"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="footDomain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pé Dominante</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Direito">Direito</SelectItem>
                              <SelectItem value="Esquerdo">Esquerdo</SelectItem>
                              <SelectItem value="Ambos">Ambos</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Posição</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: Atacante" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <DialogFooter className="flex flex-row-reverse gap-2 mt-4">
              <Button type="submit" disabled={editProfile.isPending}>
                {editProfile.isPending ? "Salvando..." : "Salvar"}
              </Button>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancelar
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
