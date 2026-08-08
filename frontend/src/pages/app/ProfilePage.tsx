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
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-4xl">Account Profile</h2>
        <p className="mt-2 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Manage your personal information and security credentials.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <span className="flex size-14 items-center justify-center rounded-2xl border border-[#344A39] bg-[#223829] font-serif text-xl font-bold text-white shadow-md">
            {(user?.name ?? "?")
              .split(/\s+/)
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-serif text-xl font-bold text-[#1F2421] dark:text-[#E6ECE7]">
              {user?.name}
              <Badge variant="success">Active Account</Badge>
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-xs text-[#6B726C] dark:text-[#A3B5A7]">
              <Mail className="size-3.5" />
              {user?.email}
            </p>
            <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-[#6B726C] dark:text-[#A3B5A7]">
              <ShieldCheck className="size-3.5 text-[#223829] dark:text-[#A3B5A7]" />
              Member since {user ? formatDate(user.created_at) : "—"}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-serif text-xl font-bold text-[#1F2421] dark:text-[#E6ECE7]">Personal Information</h3>
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
            label="Email address"
            type="email"
            leftIcon={<Mail className="size-4" />}
            error={profileForm.formState.errors.email?.message}
            {...profileForm.register("email")}
          />
          <div className="flex justify-end pt-2">
            <Button type="submit" loading={savingProfile}>
              {savingProfile ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="font-serif text-xl font-bold text-[#1F2421] dark:text-[#E6ECE7]">Change Password</h3>
        <p className="mt-1 text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Must be at least 8 characters long with letters and numbers.
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
          <div className="flex justify-end pt-2">
            <Button type="submit" variant="secondary" loading={savingPassword}>
              {savingPassword ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}