import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Target, GraduationCap, Pencil, Save, X } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export function ProfileHero({ 
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
  const initials = (form.display_name || "U").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className="relative mb-12">
      <div className="h-48 w-full bg-gradient-to-r from-indigo-900/50 via-purple-900/30 to-slate-900 rounded-3xl border border-white/5 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute top-10 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-12 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-8">
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
              <CheckCircleSmall size={12} className="text-white" />
            </div>
          )}
        </div>

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

function CheckCircleSmall({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
