import { memo, useMemo } from "react";
import { Camera, Target, GraduationCap, Pencil, Save, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export const ProfileHero = memo(function ProfileHero({
  form, 
  isEditing, 
  isNew, 
  saving, 
  selectedImageFile, 
  imagePreviewUrl, 
  handleImageSelect, 
  handleSave, 
  setIsEditing, 
  setForm, 
  profile,
  setImagePreviewUrl
}) {
  const initials = useMemo(
    () => (form.display_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
    [form.display_name]
  );
  const imageSrc = imagePreviewUrl || (
    form.profile_image
      ? form.profile_image.startsWith("http")
        ? form.profile_image
        : `${import.meta.env.VITE_API_URL}${form.profile_image}`
      : null
  );

  return (
    <section className="relative mb-12">
      <div className="h-48 w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4" />
      </div>
      
      <div className="px-4 sm:px-12 -mt-20 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
        <div className="relative group shrink-0">
          <div className={cn(
            "h-32 w-32 sm:h-40 sm:w-40 rounded-[2rem] border-[6px] border-slate-50 overflow-hidden shadow-xl relative transition-transform duration-500 group-hover:scale-105",
            !form.profile_image && !imagePreviewUrl && "bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-4xl sm:text-5xl font-bold text-white"
          )}>
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile"
                className="h-full w-full object-cover"
                width="160"
                height="160"
                loading="eager"
                decoding="async"
              />
            ) : initials}
            
            {isEditing && (
                <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-6 w-6 sm:h-8 sm:w-8 text-white mb-1" />
                  <span className="text-[8px] sm:text-[10px] font-bold text-white uppercase tracking-widest">Change Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                </label>
              )}
          </div>
          {selectedImageFile && (
            <div className="absolute -top-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircleSmall size={12} className="text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight break-words">
              {form.display_name || "New Student"}
            </h1>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <Badge color="emerald" icon={Target}>{form.skill_level || "No Level"}</Badge>
              <Badge color="indigo" icon={GraduationCap}>{form.education_level || "Student"}</Badge>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl text-base sm:text-lg font-medium leading-relaxed break-words">
            {form.bio || "Crafting a unique learning journey with PathForge."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0 md:mb-4 shrink-0 justify-center md:justify-end w-full md:w-auto">
          {isEditing ? (
            <>
              {!isNew && (
                <Button variant="ghost" onClick={() => { setIsEditing(false); setForm({...profile}); setImagePreviewUrl(null); }} disabled={saving} className="h-10 px-4">
                  <X className="mr-2 h-4 w-4" /> Cancel
                </Button>
              )}
              <Button onClick={handleSave} isLoading={saving} className="h-10 px-6">
                <Save className="mr-2 h-4 w-4" /> {isNew ? "Create Profile" : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="secondary" className="h-10 px-6">
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </div>
      </div>
    </section>
  );
});

const Badge = memo(function Badge({ children, color = "indigo", icon: Icon }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border", styles[color])}>
      {Icon && <Icon size={12} />}
      {children}
    </div>
  );
});

function CheckCircleSmall({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
