import { memo, useCallback, useState } from "react";
import { 
  User, GraduationCap, Sparkles, Globe, Heart, 
  X, Code2, Link2, ExternalLink 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Input } from "../ui/Input";
import { cn } from "../../lib/utils";

const SKILL_LEVELS = ["beginner", "intermediate", "advanced"];
const LEARNING_STYLES = ["visual", "reading", "hands-on", "video", "mixed"];

// ─── Shared Components ───

export const Field = memo(function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[10px] text-slate-400 font-medium">{hint}</span>}
      </div>
      {children}
    </div>
  );
});

export const ReadField = memo(function ReadField({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={cn("text-base font-semibold tracking-tight", value ? "text-slate-800" : "text-slate-400 italic")}>
        {value || "Unspecified"}
      </p>
    </div>
  );
});

const TagInput = memo(function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState("");

  const handleKeyDown = useCallback((e) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }, [input, setTags, tags]);

  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 bg-white min-h-[50px] focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-400 transition-all">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-semibold border border-indigo-100"
        >
          {tag}
          <button
            type="button"
            onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
            className="text-indigo-400 hover:text-indigo-700 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
      />
    </div>
  );
});

// ─── Sections ───

export const IdentitySection = memo(function IdentitySection({ isEditing, form, handleChange }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <User size={20} />
          </div>
          <CardTitle className="text-lg">Identity</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing ? (
          <>
            <Field label="Display Name"><Input value={form.display_name} onChange={e => handleChange("display_name", e.target.value)} placeholder="Full Name" /></Field>
            <Field label="Career Goal"><Input value={form.career_goal} onChange={e => handleChange("career_goal", e.target.value)} placeholder="e.g. AI Researcher" /></Field>
            <div className="md:col-span-2">
              <Field label="Bio"><textarea value={form.bio} onChange={e => handleChange("bio", e.target.value)} rows={3} className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all resize-none" placeholder="Tell us about your learning passion..." /></Field>
            </div>
          </>
        ) : (
          <>
            <ReadField label="Full Name" value={form.display_name} />
            <ReadField label="Career Goal" value={form.career_goal} />
            <div className="md:col-span-2"><ReadField label="Bio" value={form.bio} /></div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export const AcademicSection = memo(function AcademicSection({ isEditing, form, handleChange }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-50 rounded-lg text-violet-600">
            <GraduationCap size={20} />
          </div>
          <CardTitle className="text-lg">Academic Context</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing ? (
          <>
            <Field label="Education Level"><Input value={form.education_level} onChange={e => handleChange("education_level", e.target.value)} placeholder="e.g. Bachelor's Degree" /></Field>
            <Field label="University"><Input value={form.college_name} onChange={e => handleChange("college_name", e.target.value)} placeholder="e.g. Stanford" /></Field>
            <Field label="Field of Study"><Input value={form.field_of_study} onChange={e => handleChange("field_of_study", e.target.value)} placeholder="e.g. Physics" /></Field>
            <Field label="Current Year"><Input type="number" min={1} max={8} value={form.current_year} onChange={e => handleChange("current_year", e.target.value)} placeholder="Year 1-8" /></Field>
          </>
        ) : (
          <>
            <ReadField label="Education Level" value={form.education_level} />
            <ReadField label="University" value={form.college_name} />
            <ReadField label="Major" value={form.field_of_study} />
            <ReadField label="Current Status" value={form.current_year ? `Year ${form.current_year}` : null} />
          </>
        )}
      </CardContent>
    </Card>
  );
});

export const LearningStyleSection = memo(function LearningStyleSection({ isEditing, form, handleChange }) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Sparkles size={20} />
          </div>
          <CardTitle className="text-lg">Learning Style</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <Field label="Proficiency">
              <select value={form.skill_level} onChange={e => handleChange("skill_level", e.target.value)} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all">
                <option value="">Select Level</option>
                {SKILL_LEVELS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="Preferred Format">
              <select value={form.preferred_learning_style} onChange={e => handleChange("preferred_learning_style", e.target.value)} className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-all">
                <option value="">Select Style</option>
                {LEARNING_STYLES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
              </select>
            </Field>
            <Field label="Weekly Commitment"><Input type="number" value={form.weekly_study_hours} onChange={e => handleChange("weekly_study_hours", e.target.value)} placeholder="Hours per week" /></Field>
          </>
        ) : (
          <>
            <ReadField label="Proficiency" value={form.skill_level} />
            <ReadField label="Format" value={form.preferred_learning_style} />
            <ReadField label="Weekly Velocity" value={form.weekly_study_hours ? `${form.weekly_study_hours} Hours` : null} />
          </>
        )}
      </CardContent>
    </Card>
  );
});

export const SocialSection = memo(function SocialSection({ isEditing, form, handleChange }) {
  return (
    <Card>
      <CardHeader className="border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
            <Globe size={20} />
          </div>
          <CardTitle className="text-lg">Network</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <Field label="GitHub"><div className="relative"><Code2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><Input value={form.github_url} onChange={e => handleChange("github_url", e.target.value)} className="pl-11" placeholder="github.com/username" /></div></Field>
            <Field label="LinkedIn"><div className="relative"><Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><Input value={form.linkedin_url} onChange={e => handleChange("linkedin_url", e.target.value)} className="pl-11" placeholder="linkedin.com/in/..." /></div></Field>
            <Field label="Portfolio"><div className="relative"><Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" /><Input value={form.portfolio_url} onChange={e => handleChange("portfolio_url", e.target.value)} className="pl-11" placeholder="yoursite.com" /></div></Field>
          </>
        ) : (
          <div className="space-y-3">
            <SocialLink url={form.github_url} icon={Code2} label="GitHub" />
            <SocialLink url={form.linkedin_url} icon={Link2} label="LinkedIn" />
            <SocialLink url={form.portfolio_url} icon={Globe} label="Website" />
            {!form.github_url && !form.linkedin_url && !form.portfolio_url && <p className="text-xs text-slate-400 italic">No links connected.</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export const InterestsSection = memo(function InterestsSection({ isEditing, form, handleChange }) {
  return (
    <Card className="lg:col-span-12">
      <CardHeader className="border-b border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-50 rounded-lg text-rose-500">
            <Heart size={20} />
          </div>
          <CardTitle className="text-lg">Interests & Hobbies</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Interests" hint="Press Enter to add">
          {isEditing ? (
            <TagInput tags={form.interests} setTags={t => handleChange("interests", t)} placeholder="AI, React, Space..." />
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.interests?.length > 0 ? form.interests.map((t, i) => <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">{t}</span>) : <span className="text-slate-400 text-xs italic">No interests listed</span>}
            </div>
          )}
        </Field>
        <Field label="Hobbies" hint="Press Enter to add">
          {isEditing ? (
            <TagInput tags={form.hobbies} setTags={t => handleChange("hobbies", t)} placeholder="Gaming, Reading, Travel..." />
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.hobbies?.length > 0 ? form.hobbies.map((t, i) => <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">{t}</span>) : <span className="text-slate-400 text-xs italic">No hobbies listed</span>}
            </div>
          )}
        </Field>
      </CardContent>
    </Card>
  );
});

const SocialLink = memo(function SocialLink({ url, icon: Icon, label }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
        <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">{label}</span>
      </div>
      <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
    </a>
  );
});
