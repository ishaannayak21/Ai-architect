import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/utils/errors";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(120, "Name is too long"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      toast.success("Account created — welcome aboard");
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to create your account"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        <>
          Already registered?{" "}
          <Link
            to={ROUTES.LOGIN}
            className="font-medium text-brand-500 hover:text-brand-400"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          label="Full name"
          placeholder="Ada Lovelace"
          autoComplete="name"
          leftIcon={<UserIcon className="size-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="size-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="At least 8 characters, a letter & a number"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <PasswordInput
          label="Confirm password"
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-xs text-ink/45 dark:text-white/40">
          By continuing you agree to our terms and privacy policy.
        </p>
      </form>
    </AuthLayout>
  );
}