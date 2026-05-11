import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
        form={form}
        isEditing={isEditing}
        isNew={isNew}
        saving={saving}
        selectedImageFile={selectedImageFile}
        imagePreviewUrl={imagePreviewUrl}
        handleImageSelect={handleImageSelect}
        handleSave={handleSave}
        setIsEditing={setIsEditing}
        setForm={setForm}
        profile={profile}
        setImagePreviewUrl={setImagePreviewUrl}
      />

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="lg:col-span-8 space-y-8">
          <IdentitySection isEditing={isEditing} form={form} handleChange={handleChange} />
          <AcademicSection isEditing={isEditing} form={form} handleChange={handleChange} />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <LearningStyleSection isEditing={isEditing} form={form} handleChange={handleChange} />
          <SocialSection isEditing={isEditing} form={form} handleChange={handleChange} />
        </div>

        <InterestsSection isEditing={isEditing} form={form} handleChange={handleChange} />
      </motion.div>
    </DashboardLayout>
  );
}

export default ProfilePage;
