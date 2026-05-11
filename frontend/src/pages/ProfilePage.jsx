import { useCallback, useEffect, useMemo, useState } from "react";

import { DashboardLayout } from "../layouts/DashboardLayout";
import { Skeleton } from "../components/ui/Skeleton";

import { useProfile, useCreateProfile, useUpdateProfile, useUploadProfileImage } from "../hooks/useProfile";
import { ProfileHero } from "../components/profile/ProfileHero";
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
  const { data: profile, isLoading, isError } = useProfile();
  const createMutation = useCreateProfile();
  const updateMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const isNew = isError || !profile;
  const profileForm = useMemo(() => profileToForm(profile), [profile]);
  const effectiveIsEditing = isNew || isEditing;
  const activeForm = effectiveIsEditing ? form : profileForm;
  const saving = createMutation.isPending || updateMutation.isPending || uploadImageMutation.isPending;

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

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
      if (isNew) {
        await createMutation.mutateAsync(payload);
      } else {
        await updateMutation.mutateAsync(payload);
      }
      setIsEditing(false);
      setSelectedImageFile(null);
    } catch { /* toast handled by hook */ }
  }, [createMutation, form, isNew, selectedImageFile, updateMutation, uploadImageMutation]);

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
        handleSave={handleSave}
        setIsEditing={startEditing}
        setForm={setForm}
        profile={profileForm}
        setImagePreviewUrl={setImagePreviewUrl}
      />

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
    </DashboardLayout>
  );
}

export default ProfilePage;
