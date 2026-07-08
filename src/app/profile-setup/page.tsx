"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import DeviceViewer from "@/components/DeviceViewer";

export default function ProfileSetupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 5");
  const [school, setSchool] = useState("");
  const [age, setAge] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from("student_profiles")
          .upsert([
            {
              id: user.id,
              full_name: name.trim(),
              current_class: grade,
              school: school.trim() || null,
              age: parseInt(age, 10) || null,
              profile_image_url: profileImage.trim() || null,
              updated_at: new Date().toISOString()
            }
          ]);

        if (error) {
          console.error("Profile save error:", error.message);
          alert("Error saving profile: " + error.message);
          setSaving(false);
          return;
        }

        // Save locally for fallback support
        localStorage.setItem("classorbit_name", name.trim());
        localStorage.setItem("classorbit_grade", grade);
        
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Profile save exception:", err);
      setSaving(false);
    }
  };

  return (
    <DeviceViewer title="Profile Personalization" deviceType="MOBILE">
      <main className="h-full min-h-screen w-full flex flex-col justify-between px-margin-page py-10 bg-white">
        
        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-primary tracking-tight">Create your Profile</h1>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Maya will personalize study goals and Socratic prompts based on your grade.
          </p>
        </div>

        {/* Setup Form */}
        <form onSubmit={handleSubmit} className="flex-grow flex flex-col justify-between mt-8 select-none">
          <div className="space-y-4">
            {/* Input Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">Student Full Name</label>
              <input 
                type="text" 
                required
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Select Grade */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">Current Class/Grade</label>
              <select 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="Grade 4">Grade 4</option>
                <option value="Grade 5">Grade 5 (Recommended)</option>
                <option value="Grade 6">Grade 6</option>
                <option value="Grade 7">Grade 7</option>
              </select>
            </div>

            {/* Input School */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">School Name</label>
              <input 
                type="text" 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="St. Mary's Academy"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </div>

            {/* Input Age */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">Age</label>
              <input 
                type="number" 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="10"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Input Profile Image URL */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-outline uppercase tracking-wider pl-1">Profile Image URL (Optional)</label>
              <input 
                type="text" 
                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-outline-variant/20 focus:outline-none focus:border-primary/50 text-xs font-semibold"
                placeholder="https://..."
                value={profileImage}
                onChange={(e) => setProfileImage(e.target.value)}
              />
            </div>
          </div>

          {/* Submit Action */}
          <button 
            type="submit"
            disabled={!name.trim() || saving}
            className={`w-full h-12 mt-10 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
              name.trim() && !saving
                ? "bg-primary text-white cursor-pointer active:scale-95 hover:bg-primary-container" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
            }`}
          >
            <span>{saving ? "Saving Details..." : "Generate Study Dashboard"}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
          </button>
        </form>

      </main>
    </DeviceViewer>
  );
}
