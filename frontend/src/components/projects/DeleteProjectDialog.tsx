import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import type { Project } from "@/types";

interface DeleteProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project | null;
  submitting: boolean;
  onConfirm: () => Promise<unknown>;
}

export function DeleteProjectDialog({
  open,
  onClose,
  project,
  submitting,
  onConfirm,
}: DeleteProjectDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete project"
      description={
        project
          ? `This will permanently delete "${project.title}". This action cannot be undone.`
          : "Delete this project permanently?"
      }
    >
      <div className="flex items-start gap-3 rounded-xl bg-red-500/10 p-3">
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500 text-white">
          <Trash2 className="size-4" />
        </span>
        <p className="text-sm text-ink/70 dark:text-white/70">
          All associated architecture data will be removed from your account.
        </p>
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="button" variant="danger" loading={submitting} onClick={() => onConfirm().then(onClose)}>
          {submitting ? "Deleting…" : "Delete project"}
        </Button>
      </div>
    </Modal>
  );
}