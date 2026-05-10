import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, GraduationCap, Briefcase, Clock, BookOpen, Heart,
  Code2, Link2, Globe, Pencil, Save, X, Sparkles, Target,
  Image as ImageIcon, Camera, ExternalLink
} from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { cn } from "../lib/utils";

import { useProfile, useCreateProfile, useUpdateProfile, useUploadProfileImage } from "../hooks/useProfile";

const SKILL_LEVELS = ["beginner", "intermediate", "advanced"];
const LEARNING_STYLES = ["visual", "reading", "hands-on", "video", "mixed"];

const EMPTY_FORM = {
  display_name: "",
  bio: "",
  profile_image: "",
  education_level: "",
  college_name: "",
  field_of_study: "",
  current_year: "",
  skill_level: "",
  career_goal: "",
  interests: [],
  hobbies: [],
  weekly_study_hours: "",
  preferred_learning_style: "",
  github_url: "",
  linkedin_url: "",
  portfolio_url: "",
};

function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
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
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-700 bg-slate-900/50 min-h-[50px] focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all shadow-inner">
      {tags.map((tag, i) => (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          key={i}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-bold border border-indigo-500/20"
        >
          {tag}
          <button
            type="button"
            onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
            className="text-indigo-400 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
      />
    </div>
  );
}

function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const isNew = isError || !profile;
  const saving = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending;

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        profile_image: profile.profile_image || "",
        education_level: profile.education_level || "",
        college_name: profile.college_name || "",
        field_of_study: profile.field_of_study || "",
        current_year: profile.current_year || "",
        skill_level: profile.skill_level || "",
        career_goal: profile.career_goal || "",
        interests: profile.interests || [],
        hobbies: profile.hobbies || [],
        weekly_study_hours: profile.weekly_study_hours || "",
        preferred_learning_style: profile.preferred_learning_style || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        portfolio_url: profile.portfolio_url || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!isLoading && isNew) setIsEditing(true);
  }, [isLoading, isNew]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const handleSave = async () => {
    const payload = {};
    for (const key in form) {
      payload[key] = form[key] === "" ? null : form[key];
    }
    payload.current_year = payload.current_year ? Number(payload.current_year) : null;
    payload.weekly_study_hours = payload.weekly_study_hours ? Number(payload.weekly_study_hours) : null;
    
    try {
      if (selectedImageFile) {
        const uploadedUrl = await uploadImageMutation.mutateAsync(selectedImageFile);
        payload.profile_image = uploadedUrl;
      }
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync(payload);
      }
      setIsEditing(false);
      setSelectedImageFile(null);
    } catch { /* toast handled by hook */ }
  };

  const initials = (form.display_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <Skeleton className="h-64 w-full rounded-2xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Profile">
      {/* ─── Hero Header & Banner ─── */}
      <section className="relative mb-12">
        <div className="h-48 w-full bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-slate-900 rounded-3xl border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
          <div className="absolute top-10 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-12 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-8">
          {/* Avatar Area */}
          <div className="relative group mx-auto md:mx-0">
            <div className={cn(
              "h-40 w-40 rounded-[2rem] border-[6px] border-slate-950 overflow-hidden shadow-2xl relative transition-transform duration-500 group-hover:scale-105",
              !form.profile_image && !imagePreviewUrl && "bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-5xl font-black text-white"
            )}>
              {(imagePreviewUrl || form.profile_image) ? (
                <img
                  src={imagePreviewUrl || (form.profile_image.startsWith("http") ? form.profile_image : `${import.meta.env.VITE_API_URL}${form.profile_image}`)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : initials}
              
              <AnimatePresence>
                {isEditing && (
                  <motion.label 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="h-8 w-8 text-white mb-1" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Change Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  </motion.label>
                )}
              </AnimatePresence>
            </div>
            {selectedImageFile && (
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-emerald-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* User Basic Info */}
          <div className="flex-1 mb-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">{form.display_name || "New Student"}</h1>
              <div className="flex gap-2 justify-center md:justify-start">
                <Badge color="emerald" icon={Target}>{form.skill_level || "No Level"}</Badge>
                <Badge color="indigo" icon={GraduationCap}>{form.education_level || "Student"}</Badge>
              </div>
            </div>
            <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">{form.bio || "Crafting a unique learning journey with PathForge."}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-4 shrink-0">
            {isEditing ? (
              <>
                {!isNew && (
                  <Button variant="ghost" onClick={() => { setIsEditing(false); setForm({...profile}); setImagePreviewUrl(null); }} disabled={saving}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                )}
                <Button onClick={handleSave} isLoading={saving} className="shadow-indigo-500/20">
                  <Save className="mr-2 h-4 w-4" /> {isNew ? "Create Profile" : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)} variant="secondary" className="glass">
                <Pencil className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ─── Profile Content Grid ─── */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {/* Left Column: Personal & Education */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="border-indigo-500/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <User size={20} />
                </div>
                <CardTitle className="text-lg">Identity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isEditing ? (
                <>
                  <Field label="Display Name"><Input value={form.display_name} onChange={e => handleChange("display_name", e.target.value)} placeholder="Full Name" /></Field>
                  <Field label="Career Goal"><Input value={form.career_goal} onChange={e => handleChange("career_goal", e.target.value)} placeholder="e.g. AI Researcher" /></Field>
                  <div className="md:col-span-2">
                    <Field label="Bio"><textarea value={form.bio} onChange={e => handleChange("bio", e.target.value)} rows={3} className="flex w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none shadow-inner" placeholder="Tell us about your learning passion..." /></Field>
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

          <Card className="border-purple-500/5">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <GraduationCap size={20} />
                </div>
                <CardTitle className="text-lg">Academic Context</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        {/* Right Column: Style & Social */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-amber-500/5">
            <CardHeader className="border-b border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                  <Sparkles size={20} />
                </div>
                <CardTitle className="text-lg">Learning Style</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {isEditing ? (
                <>
                  <Field label="Proficiency">
                    <select value={form.skill_level} onChange={e => handleChange("skill_level", e.target.value)} className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner">
                      <option value="">Select Level</option>
                      {SKILL_LEVELS.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Format">
                    <select value={form.preferred_learning_style} onChange={e => handleChange("preferred_learning_style", e.target.value)} className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner">
                      <option value="">Select Style</option>
                      {LEARNING_STYLES.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                    </select>
                  </Field>
                  <Field label="Weekly Commitment"><Input type="number" value={form.weekly_study_hours} onChange={e => handleChange("weekly_study_hours", e.target.value)} placeholder="Hours per week" /></Field>
                </>
              ) : (
                <>
                  <ReadField label="Proficiency" value={form.skill_level} capitalize />
                  <ReadField label="Format" value={form.preferred_learning_style} capitalize />
                  <ReadField label="Weekly Velocity" value={form.weekly_study_hours ? `${form.weekly_study_hours} Hours` : null} />
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-cyan-500/5">
            <CardHeader className="border-b border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                  <Globe size={20} />
                </div>
                <CardTitle className="text-lg">Network</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <Field label="GitHub"><div className="relative"><Code2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><Input value={form.github_url} onChange={e => handleChange("github_url", e.target.value)} className="pl-11" placeholder="github.com/username" /></div></Field>
                  <Field label="LinkedIn"><div className="relative"><Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><Input value={form.linkedin_url} onChange={e => handleChange("linkedin_url", e.target.value)} className="pl-11" placeholder="linkedin.com/in/..." /></div></Field>
                  <Field label="Portfolio"><div className="relative"><Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" /><Input value={form.portfolio_url} onChange={e => handleChange("portfolio_url", e.target.value)} className="pl-11" placeholder="yoursite.com" /></div></Field>
                </>
              ) : (
                <div className="space-y-3">
                  <SocialLink url={form.github_url} icon={Code2} label="GitHub" />
                  <SocialLink url={form.linkedin_url} icon={Link2} label="LinkedIn" />
                  <SocialLink url={form.portfolio_url} icon={Globe} label="Website" />
                  {!form.github_url && !form.linkedin_url && !form.portfolio_url && <p className="text-xs text-slate-600 italic">No links connected.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Interests: Wide Card */}
        <Card className="lg:col-span-12 border-rose-500/5">
          <CardHeader className="border-b border-white/5 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                <Heart size={20} />
              </div>
              <CardTitle className="text-lg">Interests & Hobbies</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="Interests" hint="Press Enter to add">
              {isEditing ? (
                <TagInput tags={form.interests} setTags={t => handleChange("interests", t)} placeholder="AI, React, Space..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.interests?.length > 0 ? form.interests.map((t, i) => <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-white/5">{t}</span>) : <span className="text-slate-600 text-xs italic">No interests listed</span>}
                </div>
              )}
            </Field>
            <Field label="Hobbies" hint="Press Enter to add">
              {isEditing ? (
                <TagInput tags={form.hobbies} setTags={t => handleChange("hobbies", t)} placeholder="Gaming, Reading, Travel..." />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.hobbies?.length > 0 ? form.hobbies.map((t, i) => <span key={i} className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold border border-white/5">{t}</span>) : <span className="text-slate-600 text-xs italic">No hobbies listed</span>}
                </div>
              )}
            </Field>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}

// ─── UI Helpers ───

function Field({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</label>
        {hint && <span className="text-[10px] text-slate-600 font-bold">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ReadField({ label, value, capitalize }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
      <p className={cn("text-base font-bold tracking-tight", value ? "text-slate-100" : "text-slate-600 italic")}>
        {value || "Unspecified"}
      </p>
    </div>
  );
}

function Badge({ children, color = "indigo", icon: Icon }) {
  const styles = {
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", styles[color])}>
      {Icon && <Icon size={12} />}
      {children}
    </div>
  );
}

function SocialLink({ url, icon: Icon, label }) {
  if (!url) return null;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all group">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
      </div>
      <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
    </a>
  );
}

function CheckCircle2({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default ProfilePage;
