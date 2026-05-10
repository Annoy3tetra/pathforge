import { useState, useEffect } from "react";
import {
  User, GraduationCap, Briefcase, Clock, BookOpen, Heart,
  Code2, Link2, Globe, Pencil, Save, X, Sparkles, Target
} from "lucide-react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";

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
    <div className="flex flex-wrap gap-1.5 p-2 rounded-md border border-slate-700 bg-slate-900/50 min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-colors">
      {tags.map((tag, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-500/30"
        >
          {tag}
          <button
            type="button"
            onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
            className="text-indigo-400 hover:text-white"
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
        className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
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
      // Cleanup previous preview url if it exists when profile data changes
      return () => {
        if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreviewUrl);
        }
      };
    }
  }, [profile]);

  // Auto-enter edit mode for new profiles
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
    // Convert empty strings to null to pass backend Pydantic validation
    const payload = {};
    for (const key in form) {
      if (form[key] === "") {
        payload[key] = null;
      } else {
        payload[key] = form[key];
      }
    }
    
    // Explicit numeric conversions
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
    } catch {
      // toast handled by hook
    }
  };

  const initials = (form.display_name || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout title="Profile">
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Profile">
      {/* ─── Hero Header ─── */}
      <div className="relative mb-8 rounded-2xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            {(imagePreviewUrl || form.profile_image) ? (
              <img
                src={imagePreviewUrl || form.profile_image.startsWith("http") ? (imagePreviewUrl || form.profile_image) : `${import.meta.env.VITE_API_URL}${form.profile_image}`}
                alt="Avatar"
                className={`h-24 w-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg shadow-indigo-500/10 ${isEditing ? 'group-hover:opacity-50 transition-opacity' : ''}`}
              />
            ) : (
              <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-500/20 border-2 border-indigo-500/30 ${isEditing ? 'group-hover:opacity-80 transition-opacity' : ''}`}>
                {initials}
              </div>
            )}
            
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-white text-xs font-semibold flex flex-col items-center gap-1">
                  <Pencil className="h-4 w-4" />
                  Upload
                </span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              {form.display_name || "Your Profile"}
            </h1>
            {form.bio && (
              <p className="text-slate-400 mt-1 max-w-xl text-sm leading-relaxed">{form.bio}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {form.skill_level && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                  <Target className="h-3 w-3" />
                  {form.skill_level}
                </span>
              )}
              {form.preferred_learning_style && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-bold uppercase tracking-wider border border-purple-500/20">
                  <BookOpen className="h-3 w-3" />
                  {form.preferred_learning_style}
                </span>
              )}
              {form.weekly_study_hours && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/20">
                  <Clock className="h-3 w-3" />
                  {form.weekly_study_hours}h / week
                </span>
              )}
            </div>
          </div>

          {/* Edit / Save */}
          <div className="shrink-0">
            {isEditing ? (
              <div className="flex gap-2">
                {!isNew && (
                  <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={saving}>
                    <X className="mr-1.5 h-4 w-4" /> Cancel
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="mr-1.5 h-4 w-4" />
                  {saving ? "Saving..." : isNew ? "Create Profile" : "Save"}
                </Button>
              </div>
            ) : (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-1.5 h-4 w-4" /> Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Cards Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Personal Info */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-indigo-400" /> Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Field label="Display Name">
                  <Input value={form.display_name} onChange={(e) => handleChange("display_name", e.target.value)} placeholder="Your name" />
                </Field>
                <Field label="Bio">
                  <textarea value={form.bio} onChange={(e) => handleChange("bio", e.target.value)} rows={3} placeholder="Tell us about yourself..." className="flex w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none" />
                </Field>
              </>
            ) : (
              <>
                <ReadField label="Display Name" value={form.display_name} />
                <ReadField label="Bio" value={form.bio} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-purple-400" /> Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Field label="Education Level">
                  <Input value={form.education_level} onChange={(e) => handleChange("education_level", e.target.value)} placeholder="e.g. Bachelor's" />
                </Field>
                <Field label="College / University">
                  <Input value={form.college_name} onChange={(e) => handleChange("college_name", e.target.value)} placeholder="e.g. MIT" />
                </Field>
                <Field label="Field of Study">
                  <Input value={form.field_of_study} onChange={(e) => handleChange("field_of_study", e.target.value)} placeholder="e.g. Computer Science" />
                </Field>
                <Field label="Current Year">
                  <Input type="number" min={1} max={8} value={form.current_year} onChange={(e) => handleChange("current_year", e.target.value)} placeholder="e.g. 3" />
                </Field>
              </>
            ) : (
              <>
                <ReadField label="Education Level" value={form.education_level} />
                <ReadField label="College" value={form.college_name} />
                <ReadField label="Field of Study" value={form.field_of_study} />
                <ReadField label="Current Year" value={form.current_year ? `Year ${form.current_year}` : null} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-amber-400" /> Learning Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Field label="Skill Level">
                  <select value={form.skill_level} onChange={(e) => handleChange("skill_level", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors">
                    <option value="">Select level</option>
                    {SKILL_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Preferred Learning Style">
                  <select value={form.preferred_learning_style} onChange={(e) => handleChange("preferred_learning_style", e.target.value)} className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors">
                    <option value="">Select style</option>
                    {LEARNING_STYLES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Weekly Study Hours">
                  <Input type="number" min={0} max={168} value={form.weekly_study_hours} onChange={(e) => handleChange("weekly_study_hours", e.target.value)} placeholder="e.g. 20" />
                </Field>
                <Field label="Career Goal">
                  <Input value={form.career_goal} onChange={(e) => handleChange("career_goal", e.target.value)} placeholder="e.g. Full-Stack Developer" />
                </Field>
              </>
            ) : (
              <>
                <ReadField label="Skill Level" value={form.skill_level} capitalize />
                <ReadField label="Learning Style" value={form.preferred_learning_style} capitalize />
                <ReadField label="Study Hours" value={form.weekly_study_hours ? `${form.weekly_study_hours} hrs/week` : null} />
                <ReadField label="Career Goal" value={form.career_goal} />
              </>
            )}
          </CardContent>
        </Card>

        {/* Interests & Hobbies */}
        <Card className="border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Heart className="h-4 w-4 text-rose-400" /> Interests & Hobbies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <Field label="Interests" hint="Press Enter to add">
                  <TagInput tags={form.interests} setTags={(t) => handleChange("interests", t)} placeholder="e.g. AI, Web Dev, Cloud" />
                </Field>
                <Field label="Hobbies" hint="Press Enter to add">
                  <TagInput tags={form.hobbies} setTags={(t) => handleChange("hobbies", t)} placeholder="e.g. Reading, Gaming" />
                </Field>
              </>
            ) : (
              <>
                <ReadField label="Interests" value={form.interests?.length > 0 ? null : null} />
                {form.interests?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 -mt-2">
                    {form.interests.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 text-xs font-medium border border-indigo-500/20">{t}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No interests added</p>
                )}
                <ReadField label="Hobbies" value={null} />
                {form.hobbies?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 -mt-2">
                    {form.hobbies.map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-300 text-xs font-medium border border-rose-500/20">{t}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No hobbies added</p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Social Links — full width */}
        <Card className="border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Globe className="h-4 w-4 text-cyan-400" /> Social & Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="GitHub">
                  <div className="relative">
                    <Code2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input value={form.github_url} onChange={(e) => handleChange("github_url", e.target.value)} placeholder="https://github.com/..." className="pl-9" />
                  </div>
                </Field>
                <Field label="LinkedIn">
                  <div className="relative">
                    <Link2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input value={form.linkedin_url} onChange={(e) => handleChange("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." className="pl-9" />
                  </div>
                </Field>
                <Field label="Portfolio">
                  <div className="relative">
                    <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <Input value={form.portfolio_url} onChange={(e) => handleChange("portfolio_url", e.target.value)} placeholder="https://yoursite.com" className="pl-9" />
                  </div>
                </Field>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <SocialLink url={form.github_url} icon={Code2} label="GitHub" />
                <SocialLink url={form.linkedin_url} icon={Link2} label="LinkedIn" />
                <SocialLink url={form.portfolio_url} icon={Globe} label="Portfolio" />
                {!form.github_url && !form.linkedin_url && !form.portfolio_url && (
                  <p className="text-xs text-slate-500 italic">No links added yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  );
}

// ─── Helper Components ───

function Field({ label, hint, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
        {hint && <span className="text-[10px] text-slate-600">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ReadField({ label, value, capitalize }) {
  return (
    <div>
      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-sm ${value ? "text-slate-200" : "text-slate-600 italic"} ${capitalize ? "capitalize" : ""}`}>
        {value || "Not set"}
      </p>
    </div>
  );
}

function SocialLink({ url, icon: Icon, label }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-slate-700 transition-all text-sm font-medium group"
    >
      <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
      {label}
    </a>
  );
}

export default ProfilePage;
