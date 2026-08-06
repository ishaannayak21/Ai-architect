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
        <h2 className="text-2xl font-bold tracking-tight">New Project</h2>
        <p className="mt-1 text-sm text-ink/55 dark:text-white/50">
          Describe your application idea and the architect engine will design a
          complete engineering blueprint.
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
            <Card className="overflow-hidden p-8">
              <div className="flex items-center gap-4">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-violet-500 text-white">
                  <BrainCircuit className="size-7" />
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-500 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-white" />
                  </span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold">The architect is working…</h3>
                  <p className="text-sm text-ink/55 dark:text-white/50">
                    Designing a production-ready blueprint from your idea.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {GENERATION_STEPS.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center">
                      {index < stepIndex ? (
                        <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
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
                          className="size-5 rounded-full border-2 border-brand-500/20 border-t-brand-500"
                        />
                      ) : (
                        <span className="size-5 rounded-full border-2 border-ink/10 dark:border-white/10" />
                      )}
                    </span>
                    <span
                      className={`text-sm transition-colors ${
                        index === stepIndex
                          ? "font-medium text-ink dark:text-white"
                          : index < stepIndex
                            ? "text-ink/55 dark:text-white/55"
                            : "text-ink/35 dark:text-white/35"
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
            <Card className="p-6">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <Input
                  label="What are you building?"
                  leftIcon={<Lightbulb className="size-4" />}
                  placeholder="Build an E-commerce Platform"
                  error={errors.title?.message}
                  autoComplete="off"
                  {...register("title")}
                />
                <Textarea
                  label="Describe it in your own words (optional)"
                  placeholder="Tell the architect about the audience, key workflows, integrations, and what success looks like…"
                  rows={5}
                  error={errors.description?.message}
                  hint="More context helps the engine design a sharper blueprint."
                  {...register("description")}
                />

                <div>
                  <p className="text-xs font-medium text-ink/45 dark:text-white/45">
                    Try an example
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EXAMPLES.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => applyExample(label)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-xs text-ink/70 transition-colors hover:border-brand-500 hover:text-brand-500 dark:border-white/15 dark:text-white/70 dark:hover:border-brand-400 dark:hover:text-brand-300"
                      >
                        <Icon className="size-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {error ? (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                    <RotateCcw className="size-4 shrink-0" />
                    {error}
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-ink/45 dark:text-white/45">
                    Powered by Google Gemini. Responses are saved to your
                    history.
                  </p>
                  <Button type="submit" size="lg">
                    <Sparkles className="size-4" />
                    Generate blueprint
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
