import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ClipboardList,
  Lightbulb,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useBlueprints } from "@/hooks/useBlueprints";
import { getApiErrorMessage } from "@/utils/errors";

const newProjectSchema = z.object({
  title: z
    .string()
    .min(2, "Describe your idea in at least 2 characters")
    .max(200, "Title is too long")
    .refine((value) => value.trim().length > 0, "Please describe your idea"),
  description: z.string().max(5000, "Description is too long"),
});

type NewProjectFormValues = z.infer<typeof newProjectSchema>;

const EXAMPLES: Array<{ label: string; icon: typeof Lightbulb }> = [
  { label: "Build an E-commerce Platform", icon: Lightbulb },
  { label: "A wellness & habit-tracking mobile app", icon: ClipboardList },
  { label: "Multi-tenant project management SaaS", icon: Sparkles },
  { label: "A food delivery marketplace", icon: Wand2 },
];

const GENERATION_STEPS = [
  "Analyzing your idea…",
  "Interviewing the stakeholders…",
  "Defining functional requirements…",
  "Designing the data model…",
  "Drafting REST contracts…",
  "Recommending the tech stack…",
  "Compiling your blueprint…",
];

export function NewProjectPage() {
  const { generateBlueprint, isGenerating } = useBlueprints();
  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { title: "", description: "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isGenerating) {
      setStepIndex(0);
      intervalRef.current = window.setInterval(() => {
        setStepIndex((index) =>
          index < GENERATION_STEPS.length - 1 ? index + 1 : index,
        );
      }, 1600);
    }
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isGenerating]);

  useEffect(() => {
    if (!isGenerating) {
      return;
    }
    const safetyTimer = window.setTimeout(() => {
      setError(
        "Generation is taking longer than expected. Please try again.",
      );
    }, 150000);
    return () => window.clearTimeout(safetyTimer);
  }, [isGenerating]);

  const applyExample = (example: string) => {
    setValue("title", example, { shouldValidate: true });
  };

  const onSubmit = async (values: NewProjectFormValues) => {
    if (isGenerating) {
      return;
    }
    setError(null);
    try {
      const blueprint = await generateBlueprint({
        title: values.title.trim(),
        description: values.description.trim(),
      });
      toast.success("Blueprint generated");
      navigate(`/blueprints/${blueprint.id}`, { replace: true });
    } catch (err) {
      const message = getApiErrorMessage(
        err,
        "We couldn't generate your blueprint. Please try again.",
      );
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1F2421] dark:text-[#E6ECE7] sm:text-4xl">New Architect Project</h2>
        <p className="mt-2 font-sans text-sm text-[#6B726C] dark:text-[#A3B5A7]">
          Describe your application concept and the architect engine will design a
          complete, production-grade engineering blueprint.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="overflow-hidden p-8 border border-[#223829]/30">
              <div className="flex items-center gap-4">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#223829] text-white font-bold shadow-md">
                  <BrainCircuit className="size-7 text-[#E8F0EA]" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#C05621] opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-[#C05621]" />
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-xl font-bold text-[#1F2421] dark:text-[#E6ECE7]">Architect Engine is Working…</h3>
                  <p className="font-mono text-xs text-[#C05621] dark:text-[#E07A48] uppercase tracking-wider font-semibold">
                    [ COMPILING ARCHITECTURE BLUEPRINT ]
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3.5">
                {GENERATION_STEPS.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      {index < stepIndex ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-[#223829] text-white font-bold">
                          <Check className="size-3" />
                        </span>
                      ) : index === stepIndex ? (
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.9,
                            ease: "linear",
                          }}
                          className="size-5 rounded-full border-2 border-[#C05621]/20 border-t-[#C05621]"
                        />
                      ) : (
                        <span className="size-5 rounded-full border-2 border-[#E6DFD5] dark:border-[#2B3D2F]" />
                      )}
                    </span>
                    <span
                      className={`font-mono text-xs transition-colors ${
                        index === stepIndex
                          ? "font-semibold text-[#1F2421] dark:text-white"
                          : index < stepIndex
                            ? "text-[#4A524C] dark:text-[#A3B5A7]"
                            : "text-[#9A9287] dark:text-[#6B726C]"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-7 sm:p-9">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                noValidate
              >
                <Input
                  label="What application are you building?"
                  leftIcon={<Lightbulb className="size-4" />}
                  placeholder="Build an E-commerce Platform"
                  error={errors.title?.message}
                  autoComplete="off"
                  {...register("title")}
                />
                <Textarea
                  label="Describe your vision & key requirements (optional)"
                  placeholder="Tell the architect about your target audience, core features, integrations, performance needs, or database constraints…"
                  rows={5}
                  error={errors.description?.message}
                  hint="More context allows the AI engine to generate sharper, deeper specifications."
                  {...register("description")}
                />

                <div>
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[#6B726C] dark:text-[#A3B5A7]">
                    QUICK EXAMPLES
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {EXAMPLES.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => applyExample(label)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#E6DFD5] bg-[#FFFFFF] px-3.5 py-1.5 text-xs text-[#1F2421] transition-all hover:border-[#C05621] hover:bg-[#FDF3EE] hover:text-[#C05621] dark:border-[#2B3D2F] dark:bg-[#1A241C] dark:text-[#E6ECE7] dark:hover:border-[#E07A48] dark:hover:bg-[#331C13] dark:hover:text-[#E07A48] font-medium"
                      >
                        <Icon className="size-3.5 text-[#C05621] dark:text-[#E07A48]" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className="flex items-center gap-2.5 rounded-xl border border-[#C05621]/30 bg-[#FDF3EE] p-4 text-sm text-[#C05621] dark:bg-[#331C13] dark:text-[#E07A48]">
                    <RotateCcw className="size-4 shrink-0" />
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-3">
                  <p className="font-mono text-xs text-[#6B726C] dark:text-[#A3B5A7]">
                    Engineered with Google Gemini · Blueprints automatically saved
                  </p>
                  <Button type="submit" size="lg">
                    <Sparkles className="size-4" />
                    Generate Blueprint
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
