import { memo, useCallback, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Compass,
  FolderKanban,
  Gauge,
  GraduationCap,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { ProgressBar } from "../components/ui/ProgressBar";
import { Skeleton } from "../components/ui/Skeleton";
import {
  useForgeProfile,
  useForgeRecommendations,
  useSaveForgeProfile,
} from "../hooks/useForgeProfile";
import { cn } from "../lib/utils";

const EMPTY_FORGE_PROFILE = {
  current_skill_level: "beginner",
  career_goal: "",
  preferred_domains: [],
  weekly_study_hours: 6,
  preferred_learning_style: "mixed",
  biggest_learning_struggle: "",
  motivation_type: "career",
  preferred_project_type: "web-app",
  confidence_level: 5,
  target_timeline: "3-months",
  preferred_resource_format: "mixed",
  interests: [],
  current_focus: "",
};

const DOMAIN_OPTIONS = ["AI/ML", "Web Development", "Data Science", "Cybersecurity", "Cloud", "Mobile", "DevOps", "UI/UX"];
const INTEREST_OPTIONS = ["Startups", "Open Source", "Research", "Gaming", "Finance", "Health", "Education", "Automation"];

const steps = [
  { title: "Direction", icon: Compass },
  { title: "Learning OS", icon: GraduationCap },
  { title: "Motivation", icon: Target },
  { title: "Personalization", icon: Brain },
];

function ForgeProfilePage() {
  const { data: forgeProfile, isLoading } = useForgeProfile();
  const { data: recommendations, isLoading: recommendationsLoading } = useForgeRecommendations();
  const saveMutation = useSaveForgeProfile();
  const [step, setStep] = useState(0);
  const [formDraft, setFormDraft] = useState(null);
  const form = useMemo(
    () => formDraft || { ...EMPTY_FORGE_PROFILE, ...(forgeProfile || {}) },
    [forgeProfile, formDraft]
  );

  const completion = useMemo(() => {
    const fields = [
      "current_skill_level",
      "career_goal",
      "preferred_domains",
      "weekly_study_hours",
      "preferred_learning_style",
      "biggest_learning_struggle",
      "motivation_type",
      "preferred_project_type",
      "confidence_level",
      "target_timeline",
      "preferred_resource_format",
      "interests",
      "current_focus",
    ];
    const answered = fields.filter((field) => {
      const value = form[field];
      return Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && value !== "";
    }).length;

    return Math.round((answered / fields.length) * 100);
  }, [form]);

  const updateField = useCallback((field, value) => {
    setFormDraft((prev) => ({
      ...(prev || { ...EMPTY_FORGE_PROFILE, ...(forgeProfile || {}) }),
      [field]: value,
    }));
  }, [forgeProfile]);

  const getDraftBase = useCallback((prev) => {
    return prev || { ...EMPTY_FORGE_PROFILE, ...(forgeProfile || {}) };
  }, [forgeProfile]);

  const markSaved = useCallback((savedProfile) => {
    setFormDraft({ ...EMPTY_FORGE_PROFILE, ...savedProfile });
  }, []);

  const toggleArrayValue = useCallback((field, value) => {
    setFormDraft((prev) => {
      const base = getDraftBase(prev);
      const current = base[field] || [];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...base, [field]: next };
    });
  }, [getDraftBase]);

  const save = useCallback(async () => {
    const savedProfile = await saveMutation.mutateAsync(form);
    markSaved(savedProfile);
  }, [form, markSaved, saveMutation]);

  const next = useCallback(async () => {
    if (step === steps.length - 1) {
      await save();
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }, [save, step]);

  const previous = useCallback(() => {
    setStep((current) => Math.max(current - 1, 0));
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="ForgeProfile">
        <Skeleton className="h-72 rounded-2xl mb-8" />
        <Skeleton className="h-96 rounded-2xl" />
      </DashboardLayout>
    );
  }

  const CurrentStep = stepComponents[step];

  return (
    <DashboardLayout title="ForgeProfile">
      <section className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-indigo-300 mb-5">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-3">
                  <Sparkles className="h-4 w-4" />
                  Student Intelligence System
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  ForgeProfile
                </h1>
                <p className="text-slate-300 leading-relaxed">
                  Teach PathForge how you learn, what motivates you, and where you want to grow. Your roadmaps and recommendations become more specific with every answer.
                </p>
              </div>
              <div className="w-full lg:w-72">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500">Profile depth</span>
                  <span className="text-sm font-black text-indigo-300">{completion}%</span>
                </div>
                <ProgressBar progress={completion} />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-[0.72fr_0.28fr] gap-6">
        <Card>
          <CardContent className="p-0">
            <StepHeader step={step} />
            <div className="p-6 sm:p-8">
              <CurrentStep form={form} updateField={updateField} toggleArrayValue={toggleArrayValue} />
              <div className="flex items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-800">
                <Button variant="secondary" onClick={previous} disabled={step === 0 || saveMutation.isPending}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button onClick={next} isLoading={saveMutation.isPending}>
                  {step === steps.length - 1 ? "Save ForgeProfile" : "Continue"}
                  {step !== steps.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <ForgeInsightPanel
          recommendations={recommendations}
          isLoading={recommendationsLoading}
          completion={completion}
        />
      </div>
    </DashboardLayout>
  );
}

const StepHeader = memo(function StepHeader({ step }) {
  return (
    <div className="grid grid-cols-4 border-b border-slate-800">
      {steps.map((item, index) => {
        const Icon = item.icon;
        const active = index === step;
        const done = index < step;

        return (
          <div key={item.title} className={cn("p-4 sm:p-5 border-r border-slate-800 last:border-r-0", active && "bg-indigo-500/5")}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-xl flex items-center justify-center border",
                done ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : active ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20" : "bg-slate-950/40 text-slate-500 border-slate-800"
              )}>
                {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">Step {index + 1}</p>
                <p className={cn("text-xs sm:text-sm font-black", active ? "text-white" : "text-slate-500")}>{item.title}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
});

function DirectionStep({ form, updateField, toggleArrayValue }) {
  return (
    <div className="space-y-7">
      <SectionIntro icon={Compass} title="Where are you heading?" text="Start with the destination and the domains that naturally pull your attention." />
      <Field label="Career Goal">
        <Input value={form.career_goal || ""} onChange={(e) => updateField("career_goal", e.target.value)} placeholder="e.g. ML Engineer building real-world AI products" />
      </Field>
      <ChipGroup label="Preferred Domains" options={DOMAIN_OPTIONS} values={form.preferred_domains || []} onToggle={(value) => toggleArrayValue("preferred_domains", value)} />
      <Field label="Current Focus">
        <Input value={form.current_focus || ""} onChange={(e) => updateField("current_focus", e.target.value)} placeholder="e.g. learning React, improving DSA, building a portfolio" />
      </Field>
    </div>
  );
}

function LearningStep({ form, updateField }) {
  return (
    <div className="space-y-7">
      <SectionIntro icon={GraduationCap} title="How should PathForge teach you?" text="This controls pacing, complexity, and the format of recommended resources." />
      <SelectCards label="Current Skill Level" value={form.current_skill_level} onChange={(value) => updateField("current_skill_level", value)} options={[
        ["beginner", "Foundation first"],
        ["intermediate", "Build and connect concepts"],
        ["advanced", "Specialize and ship"],
      ]} />
      <SliderField label="Weekly Study Hours" value={form.weekly_study_hours || 6} min={1} max={40} suffix="hrs" onChange={(value) => updateField("weekly_study_hours", value)} />
      <SelectCards label="Learning Style" value={form.preferred_learning_style} onChange={(value) => updateField("preferred_learning_style", value)} options={[
        ["visual", "Diagrams and maps"],
        ["reading", "Articles and notes"],
        ["hands-on", "Build while learning"],
        ["video", "Guided walkthroughs"],
        ["mixed", "Blend formats"],
      ]} />
    </div>
  );
}

function MotivationStep({ form, updateField }) {
  return (
    <div className="space-y-7">
      <SectionIntro icon={Target} title="What keeps you moving?" text="ForgeProfile uses motivation and friction to recommend better next steps, not just longer lists." />
      <SelectCards label="Motivation Type" value={form.motivation_type} onChange={(value) => updateField("motivation_type", value)} options={[
        ["career", "Career growth"],
        ["portfolio", "Portfolio proof"],
        ["curiosity", "Curiosity"],
        ["startup", "Startup idea"],
        ["grades", "Academic goals"],
        ["discipline", "Build consistency"],
      ]} />
      <Field label="Biggest Learning Struggle">
        <Input value={form.biggest_learning_struggle || ""} onChange={(e) => updateField("biggest_learning_struggle", e.target.value)} placeholder="e.g. I start projects but struggle to finish them" />
      </Field>
      <SliderField label="Confidence Level" value={form.confidence_level || 5} min={1} max={10} suffix="/10" onChange={(value) => updateField("confidence_level", value)} />
    </div>
  );
}

function PersonalizationStep({ form, updateField, toggleArrayValue }) {
  return (
    <div className="space-y-7">
      <SectionIntro icon={Brain} title="Shape your growth engine." text="These answers help PathForge suggest projects, learning tracks, and roadmap themes automatically." />
      <SelectCards label="Preferred Project Type" value={form.preferred_project_type} onChange={(value) => updateField("preferred_project_type", value)} options={[
        ["web-app", "Web app"],
        ["mobile-app", "Mobile app"],
        ["ai-project", "AI project"],
        ["data-project", "Data project"],
        ["automation", "Automation"],
        ["open-source", "Open source"],
      ]} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Target Timeline">
          <select value={form.target_timeline || "3-months"} onChange={(e) => updateField("target_timeline", e.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm text-slate-100">
            <option value="1-month">1 month</option>
            <option value="3-months">3 months</option>
            <option value="6-months">6 months</option>
            <option value="12-months">12 months</option>
            <option value="flexible">Flexible</option>
          </select>
        </Field>
        <Field label="Resource Format">
          <select value={form.preferred_resource_format || "mixed"} onChange={(e) => updateField("preferred_resource_format", e.target.value)} className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 text-sm text-slate-100">
            <option value="mixed">Mixed</option>
            <option value="video">Video</option>
            <option value="article">Article</option>
            <option value="course">Course</option>
            <option value="docs">Docs</option>
            <option value="project">Project-based</option>
          </select>
        </Field>
      </div>
      <ChipGroup label="Interests" options={INTEREST_OPTIONS} values={form.interests || []} onToggle={(value) => toggleArrayValue("interests", value)} />
    </div>
  );
}

const stepComponents = [DirectionStep, LearningStep, MotivationStep, PersonalizationStep];

const SectionIntro = memo(function SectionIntro({ icon: Icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-2xl font-black text-white mb-1">{title}</h2>
        <p className="text-sm text-slate-400 leading-relaxed">{text}</p>
      </div>
    </div>
  );
});

const Field = memo(function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{label}</span>
      {children}
    </label>
  );
});

const ChipGroup = memo(function ChipGroup({ label, options, values, onToggle }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={cn(
                "px-3 py-2 rounded-xl border text-xs font-bold transition-colors",
                selected
                  ? "bg-indigo-500/15 border-indigo-500/40 text-indigo-200"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
});

const SelectCards = memo(function SelectCards({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">{label}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map(([id, text]) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "min-h-20 rounded-2xl border p-4 text-left transition-colors",
              value === id
                ? "bg-indigo-500/15 border-indigo-500/40 text-white"
                : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
            )}
          >
            <span className="block text-sm font-black capitalize mb-1">{id.replace("-", " ")}</span>
            <span className="text-xs leading-relaxed">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

const SliderField = memo(function SliderField({ label, value, min, max, suffix, onChange }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-sm font-black text-indigo-300">{value}{suffix}</p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-indigo-500"
      />
    </div>
  );
});

const ForgeInsightPanel = memo(function ForgeInsightPanel({ recommendations, isLoading, completion }) {
  if (isLoading) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  const analysis = recommendations?.analysis;

  return (
    <aside className="space-y-4">
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-amber-300" />
            <h3 className="text-lg font-black text-white">Live Guidance</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-5">
            {analysis?.personalization_summary || "Your recommendations will sharpen as ForgeProfile gets more context."}
          </p>
          <div className="grid grid-cols-3 gap-2">
            <MiniStat icon={Gauge} label="Depth" value={`${completion}%`} />
            <MiniStat icon={Target} label="Ready" value={analysis?.readiness_score ?? "—"} />
            <MiniStat icon={Brain} label="Pace" value={analysis?.pace_label || "—"} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="h-5 w-5 text-indigo-300" />
            <h3 className="text-lg font-black text-white">Next Best Moves</h3>
          </div>
          <div className="space-y-3">
            {(recommendations?.recommended_next_steps || []).slice(0, 5).map((item) => (
              <div key={item} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-xs font-semibold text-slate-300 leading-relaxed">
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
});

const MiniStat = memo(function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-center">
      <Icon className="h-4 w-4 text-indigo-300 mx-auto mb-2" />
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mb-1">{label}</p>
      <p className="text-xs font-black text-white capitalize truncate">{value}</p>
    </div>
  );
});

export default ForgeProfilePage;
