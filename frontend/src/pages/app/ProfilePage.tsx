import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ShieldCheck, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import * as authService from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/errors";
import { formatDate } from "@/utils/formatters";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(120, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      name: user?.name ?? "",
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const saveProfile = async (values: ProfileFormValues) => {
    if (!user) {
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await authService.updateProfile({ name: values.name, email: values.email });
      setUser(updated);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update profile"));
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (values: PasswordFormValues) => {
    if (!user) {
      return;
    }
    setSavingPassword(true);
    try {
      await authService.updateProfile({ password: values.newPassword });
      passwordForm.reset();
      toast.success("Password updated");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Could not update password"));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Manage your personal information and account security.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-bold text-white">
            {(user?.name ?? "?")
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-semibold">
              {user?.name}
              <Badge variant="brand">Active</Badge>
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink/55 dark:text-white/50">
              <Mail className="size-3.5" />
              {user?.email}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink/45 dark:text-white/45">
              <ShieldCheck className="size-3.5" />
              Member since {user ? formatDate(user.created_at) : "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Personal information</h3>
        <form
          onSubmit={profileForm.handleSubmit(saveProfile)}
          className="mt-4 space-y-4"
          noValidate
        >
          <Input
            label="Full name"
            leftIcon={<UserIcon className="size-4" />}
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register("name")}
          />
          <Input
            label="Email"
            type="email"
            leftIcon={<Mail className="size-4" />}
            error={profileForm.formState.errors.email?.message}
            {...profileForm.register("email")}
          />
          <div className="flex justify-end">
            <Button type="submit" loading={savingProfile}>
              {savingProfile ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold">Change password</h3>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Use at least 8 characters with a letter and a number.
        </p>
        <form
          onSubmit={passwordForm.handleSubmit(savePassword)}
          className="mt-4 space-y-4"
          noValidate
        >
          <PasswordInput
            label="Current password"
            autoComplete="current-password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register("currentPassword")}
          />
          <PasswordInput
            label="New password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register("newPassword")}
          />
          <PasswordInput
            label="Confirm new password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register("confirmPassword")}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="secondary" loading={savingPassword}>
              {savingPassword ? "Updating…" : "Update password"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}