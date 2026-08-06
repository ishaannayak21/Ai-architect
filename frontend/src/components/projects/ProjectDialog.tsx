import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import type { CreateProjectPayload, Project } from "@/types";

const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title is too long")
    .refine((value) => value.trim().length > 0, {
      message: "Title is required",
    }),
  description: z.string().max(5000, "Description is too long"),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
  submitting: boolean;
  onSubmit: (data: CreateProjectPayload) => Promise<unknown>;
}

export function ProjectDialog({
  open,
  onClose,
  project,
  submitting,
  onSubmit,
}: ProjectDialogProps) {
  const isEditing = Boolean(project);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: project?.title ?? "",
        description: project?.description ?? "",
      });
    }
  }, [open, project, reset]);

  const submit = handleSubmit((values) => {
    return onSubmit(values).then(() => {
      onClose();
    });
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit project" : "New project"}
      description={
        isEditing
          ? "Update the details of your project."
          : "Give your project a name — the AI engine will flesh out the rest."
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Input
          label="Title"
          placeholder="E-commerce Platform"
          error={errors.title?.message}
          {...register("title")}
        />
        <Textarea
          label="Description"
          placeholder="Describe your idea in a few sentences…"
          rows={4}
          error={errors.description?.message}
          hint="Optional — add context to help the architect."
          {...register("description")}
        />
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {isEditing ? "Save changes" : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}