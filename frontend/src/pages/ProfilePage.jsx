import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Skeleton } from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";

import { useProfile, useCreateProfile, useUpdateProfile, useUploadProfileImage, useUploadProfileBanner } from "../hooks/useProfile";
import { ProfileHero } from "../components/profile/ProfileHero";
import { Button } from "../components/ui/Button";
import { 
  IdentitySection, 
  AcademicSection, 
  LearningStyleSection, 
  SocialSection, 
  InterestsSection 
} from "../components/profile/ProfileFormSections";

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

function profileToForm(profile) {
  if (!profile) return EMPTY_FORM;

  return {
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
  };
}

function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();
  const uploadBannerMutation = useUploadProfileBanner();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState(null);

  const isNew = isError || !profile;
  const profileForm = useMemo(() => profileToForm(profile), [profile]);
  const effectiveIsEditing = isNew || isEditing;
  const activeForm = effectiveIsEditing ? form : profileForm;
  const saving = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending || uploadBannerMutation.isPending;

  const completion = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.display_name,
      profile.bio,
      profile.profile_image,
      profile.banner_image,
      profile.education_level,
      profile.college_name,
      profile.field_of_study,
      profile.current_year,
      profile.skill_level,
      profile.career_goal,
      profile.weekly_study_hours,
      profile.preferred_learning_style,
      profile.github_url,
      profile.linkedin_url,
      profile.portfolio_url
    ];
    const filledFields = fields.filter(f => f !== null && f !== undefined && f !== "").length;
    const arrayFields = (profile.interests?.length > 0 ? 1 : 0) + (profile.hobbies?.length > 0 ? 1 : 0);
    return Math.round(((filledFields + arrayFields) / (fields.length + 2)) * 100);
  }, [profile]);

  const handleDeleteAccount = useCallback(async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone."
    );
    if (!confirmed) return;

    try {
      await API.delete(ENDPOINTS.AUTH.DELETE_ACCOUNT);
      toast.success("Account deleted successfully.");
      logout();
      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete account. Please try again.");
    }
  }, [logout, navigate]);

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageSelect = useCallback((fileOrEvent) => {
    const file = fileOrEvent instanceof File ? fileOrEvent : fileOrEvent?.target?.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  }, []);

  const handleBannerSelect = useCallback((fileOrEvent) => {
    const file = fileOrEvent instanceof File ? fileOrEvent : fileOrEvent?.target?.files?.[0];
    if (file) {
      setSelectedBannerFile(file);
      const url = URL.createObjectURL(file);
      setBannerPreviewUrl(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      if (bannerPreviewUrl) URL.revokeObjectURL(bannerPreviewUrl);
    };
  }, [imagePreviewUrl, bannerPreviewUrl]);

  const handleSave = useCallback(async () => {
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
      if (selectedBannerFile) {
        const uploadedBannerUrl = await uploadBannerMutation.mutateAsync(selectedBannerFile);
        payload.banner_image = uploadedBannerUrl;
      }
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync(payload);
      }
      setIsEditing(false);
      setSelectedImageFile(null);
      setSelectedBannerFile(null);
    } catch { /* toast handled by hook */ }
  }, [createMutation, form, isNew, selectedImageFile, selectedBannerFile, updateMutation, uploadImageMutation, uploadBannerMutation]);

  const startEditing = useCallback((nextValue) => {
    if (typeof nextValue === "function") {
      setIsEditing(nextValue);
      return;
    }

    if (nextValue) {
      setForm(profileForm);
    }
    setIsEditing(nextValue);
  }, [profileForm]);

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
      <ProfileHero 
        form={activeForm}
        isEditing={effectiveIsEditing}
        isNew={isNew}
        saving={saving}
        selectedImageFile={selectedImageFile}
        imagePreviewUrl={imagePreviewUrl}
        handleImageSelect={handleImageSelect}
        selectedBannerFile={selectedBannerFile}
        bannerPreviewUrl={bannerPreviewUrl}
        handleBannerSelect={handleBannerSelect}
        handleSave={handleSave}
        setIsEditing={startEditing}
        setForm={setForm}
        profile={profileForm}
        setImagePreviewUrl={setImagePreviewUrl}
        setBannerPreviewUrl={setBannerPreviewUrl}
      />

      {/* Profile Completion Meter Card */}
      {!isNew && (
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-violet-50/50 border border-indigo-100/60 shadow-sm flex flex-col md:flex-row md:items-center gap-6 justify-between animate-in fade-in duration-300">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                <Sparkles size={20} className="animate-pulse" />
              </span>
              <div>
                <h3 className="font-bold text-slate-800 text-base leading-tight">Profile Completion</h3>
                <p className="text-xs text-slate-500 font-medium">A complete profile ensures more personalization.</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              💡 Fill in your learning style, career goals, and academic history to receive higher fidelity AI recommendations.
            </p>
          </div>
          <div className="flex items-center gap-4 min-w-[200px] shrink-0">
            <div className="flex-1 space-y-1">
              <div className="w-full bg-slate-200/60 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Progress</span>
                <span>{completion}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6 sm:gap-8">
          <IdentitySection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
          <AcademicSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
          <div className="lg:hidden">
             <LearningStyleSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
          </div>
          <InterestsSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
        </div>

        {/* Right Column (Desktop) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 sm:gap-8">
          <LearningStyleSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
          <SocialSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
        </div>

        {/* Social Section (Mobile) */}
        <div className="lg:hidden space-y-6">
          <SocialSection isEditing={effectiveIsEditing} form={activeForm} handleChange={handleChange} />
        </div>
      </div>

      {/* Danger Zone */}
      {!isNew && (
        <div className="mt-10 p-6 rounded-3xl border border-red-100 bg-red-50/20 space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-800">Danger Zone</h3>
              <p className="text-sm text-slate-500">
                Deleting your account is permanent. This will delete all your profile settings, learning intelligence (ForgeProfile), generated roadmaps, and milestones.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl h-11 px-6 shadow-sm shadow-red-200"
            >
              Delete Account
            </Button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ProfilePage;
