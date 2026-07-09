"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, Weakness } from "@/types/learning";
import { mockWeaknesses, initialChatMessages } from "@/lib/mock/learning";
import { supabase, hasSupabase, getLocalProfileId } from "@/lib/supabase";

interface LearningContextType {
  studentMins: number;
  dailyGoal: number;
  studentName: string;
  studentGrade: string;
  activeSubject: string;
  activeChapter: string;
  activeTopic: string;
  percentComplete: number;
  weaknesses: Weakness[];
  chatMessages: Message[];
  addChatMessage: (text: string, sender: "USER" | "AI") => void;
  incrementStudyTime: (mins: number) => void;
  updateProgress: (percent: number) => void;
  submitQuizScore: (score: number) => void;
  resolveWeakness: (id: string) => void;
  resetChat: () => void;
  initializeChatForTopic: (topicName: string, welcomeMsg: string) => void;
  setActiveSubject: (subject: string) => void;
  setActiveChapter: (chapter: string) => void;
  setActiveTopic: (topic: string) => void;
  updateProfile: (name: string, grade: string) => Promise<void>;
}

const LearningContext = createContext<LearningContextType | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [studentMins, setStudentMins] = useState(42);
  const [dailyGoal] = useState(60);
  const [studentName, setStudentName] = useState("Maya");
  const [studentGrade, setStudentGrade] = useState("Grade 5");
  const [activeSubject, setActiveSubject] = useState("Mathematics");
  const [activeChapter, setActiveChapter] = useState("Chapter 4: Fractions");
  const [activeTopic, setActiveTopic] = useState("Mixed Numbers");
  const [percentComplete, setPercentComplete] = useState(65);
  const [weaknesses, setWeaknesses] = useState<Weakness[]>(mockWeaknesses);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialChatMessages);

  const profileId = getLocalProfileId();

  // Load from Supabase or localStorage
  useEffect(() => {
    async function loadData() {
      if (hasSupabase && supabase) {
        try {
          // 1. Fetch Profile
          let { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", profileId)
            .single();

          if (error && error.code === "PGRST116") {
            // Profile doesn't exist, create it
            const defaultProfile = {
              id: profileId,
              full_name: "Maya Sharma",
              current_class: "Grade 5",
              school: "St. Mary's Academy",
              age: 10,
              daily_goal_mins: 60,
              student_mins: 42,
              percent_complete: 65
            };
            const { data: newProfile } = await supabase
              .from("profiles")
              .insert([defaultProfile])
              .select()
              .single();
            
            if (newProfile) {
              setStudentName(newProfile.full_name);
              setStudentMins(newProfile.student_mins);
              setPercentComplete(newProfile.percent_complete);
              setStudentGrade(newProfile.current_class || "Grade 5");
            }
          } else if (profile) {
            setStudentName(profile.full_name);
            setStudentMins(profile.student_mins);
            setPercentComplete(profile.percent_complete);
            setStudentGrade(profile.current_class || "Grade 5");
          }

          // 2. Fetch Chat Messages
          const { data: messages } = await supabase
            .from("tutor_messages")
            .select("*")
            .eq("profile_id", profileId)
            .order("created_at", { ascending: true });

          if (messages && messages.length > 0) {
            setChatMessages(messages.map((m: any) => ({
              id: m.id,
              sender: m.sender,
              text: m.text,
              createdAt: m.created_at
            })));
          } else {
            // Seed first message
            await supabase.from("tutor_messages").insert([{
              profile_id: profileId,
              sender: "AI",
              text: "Hello! I'm Maya, your learning companion. We are studying Chapter 4: Fractions today. What can I help you understand?"
            }]);
          }

          // 3. Fetch Weaknesses
          const { data: dbWeaknesses } = await supabase
            .from("weaknesses")
            .select("*")
            .eq("profile_id", profileId);

          if (dbWeaknesses && dbWeaknesses.length > 0) {
            setWeaknesses(dbWeaknesses.map((w: any) => ({
              id: w.id,
              skillName: w.skill_name,
              score: Number(w.score),
              notes: w.notes
            })));
          } else {
            // Seed initial weaknesses if empty
            const seedWeaknesses = mockWeaknesses.map(w => ({
              profile_id: profileId,
              skill_name: w.skillName,
              score: w.score,
              notes: w.notes
            }));
            await supabase.from("weaknesses").insert(seedWeaknesses);
          }
        } catch (e) {
          console.warn("Supabase loading error, falling back to localStorage:", e);
          loadLocalStorageFallback();
        }
      } else {
        loadLocalStorageFallback();
      }
    }

    loadData();
  }, [profileId]);

  const loadLocalStorageFallback = () => {
    const savedMins = localStorage.getItem("classorbit_mins");
    if (savedMins) setStudentMins(parseInt(savedMins, 10));

    const savedProgress = localStorage.getItem("classorbit_progress");
    if (savedProgress) setPercentComplete(parseInt(savedProgress, 10));

    const savedMessages = localStorage.getItem("classorbit_chat");
    if (savedMessages) setChatMessages(JSON.parse(savedMessages));

    const savedWeaknesses = localStorage.getItem("classorbit_weaknesses");
    if (savedWeaknesses) setWeaknesses(JSON.parse(savedWeaknesses));

    const savedName = localStorage.getItem("classorbit_name");
    if (savedName) setStudentName(savedName);

    const savedGrade = localStorage.getItem("classorbit_grade");
    if (savedGrade) setStudentGrade(savedGrade);
  };

  const updateProfile = async (name: string, grade: string) => {
    setStudentName(name);
    setStudentGrade(grade);

    if (hasSupabase && supabase) {
      try {
        await supabase
          .from("profiles")
          .update({ full_name: name, current_class: grade })
          .eq("id", profileId);
      } catch (err) {
        console.error("Failed to save profile to Supabase:", err);
      }
    } else {
      localStorage.setItem("classorbit_name", name);
      localStorage.setItem("classorbit_grade", grade);
    }
  };

  const addChatMessage = async (text: string, sender: "USER" | "AI") => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      text,
      createdAt: new Date().toISOString()
    };
    
    setChatMessages((prev) => {
      const updated = [...prev, newMessage];
      if (!hasSupabase) {
        localStorage.setItem("classorbit_chat", JSON.stringify(updated));
      }
      return updated;
    });

    if (hasSupabase && supabase) {
      await supabase.from("tutor_messages").insert([{
        profile_id: profileId,
        sender,
        text
      }]);
    }

    // Call API Socratic Tutor if message was from USER
    if (sender === "USER") {
      try {
        // We will call our Socratic AI Tutor API route
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: chatMessages.slice(-6).map(m => ({ sender: m.sender, text: m.text })),
            subject: activeSubject,
            topic: activeTopic
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          const replyText = data.text;
          
          const aiMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            sender: "AI",
            text: replyText,
            createdAt: new Date().toISOString()
          };
          
          setChatMessages((prev) => {
            const updated = [...prev, aiMessage];
            if (!hasSupabase) {
              localStorage.setItem("classorbit_chat", JSON.stringify(updated));
            }
            return updated;
          });

          if (hasSupabase && supabase) {
            await supabase.from("tutor_messages").insert([{
              profile_id: profileId,
              sender: "AI",
              text: replyText
            }]);
          }
        }
      } catch (err) {
        console.error("AI response fetch error:", err);
      }
    }
  };

  const incrementStudyTime = async (mins: number) => {
    const newMins = Math.min(studentMins + mins, 180);
    setStudentMins(newMins);
    
    if (hasSupabase && supabase) {
      await supabase
        .from("profiles")
        .update({ student_mins: newMins })
        .eq("id", profileId);
    } else {
      localStorage.setItem("classorbit_mins", newMins.toString());
    }
  };

  const updateProgress = async (percent: number) => {
    const newPercent = Math.min(Math.max(percent, 0), 100);
    setPercentComplete(newPercent);

    if (hasSupabase && supabase) {
      await supabase
        .from("profiles")
        .update({ percent_complete: newPercent })
        .eq("id", profileId);
    } else {
      localStorage.setItem("classorbit_progress", newPercent.toString());
    }
  };

  const submitQuizScore = async (score: number) => {
    if (hasSupabase && supabase) {
      await supabase.from("quiz_attempts").insert([{
        profile_id: profileId,
        topic_id: activeTopic,
        score
      }]);
    }

    if (score >= 80) {
      // Clear or reduce weaknesses
      const updated = weaknesses.map((w) => {
        if (w.skillName === "Dividing Mixed Numbers") {
          return { ...w, score: Math.min(w.score + 0.2, 1.0), notes: "Progressing well! Gaps are closing." };
        }
        return w;
      });
      setWeaknesses(updated);

      if (hasSupabase && supabase) {
        const target = weaknesses.find(w => w.skillName === "Dividing Mixed Numbers");
        if (target) {
          await supabase
            .from("weaknesses")
            .update({ score: Math.min(target.score + 0.2, 1.0), notes: "Progressing well! Gaps are closing." })
            .eq("id", target.id);
        }
      } else {
        localStorage.setItem("classorbit_weaknesses", JSON.stringify(updated));
      }
      updateProgress(percentComplete + 10);
    }
  };

  const resolveWeakness = async (id: string) => {
    setWeaknesses((prev) => {
      const updated = prev.filter((w) => w.id !== id);
      if (!hasSupabase) {
        localStorage.setItem("classorbit_weaknesses", JSON.stringify(updated));
      }
      return updated;
    });

    if (hasSupabase && supabase) {
      await supabase.from("weaknesses").delete().eq("id", id);
    }
  };

  const resetChat = async () => {
    setChatMessages(initialChatMessages);
    if (hasSupabase && supabase) {
      await supabase.from("tutor_messages").delete().eq("profile_id", profileId);
      await supabase.from("tutor_messages").insert([{
        profile_id: profileId,
        sender: "AI",
        text: "Hello! I'm Maya, your learning companion. We are studying Chapter 4: Fractions today. What can I help you understand?"
      }]);
    } else {
      localStorage.removeItem("classorbit_chat");
    }
  };

  const initializeChatForTopic = async (topicName: string, welcomeMsg: string) => {
    setActiveTopic(topicName);
    setChatMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: "AI",
        text: welcomeMsg,
        createdAt: new Date().toISOString()
      }
    ]);

    if (hasSupabase && supabase) {
      try {
        await supabase.from("tutor_messages").delete().eq("profile_id", profileId);
        await supabase.from("tutor_messages").insert([{
          profile_id: profileId,
          sender: "AI",
          text: welcomeMsg
        }]);
      } catch (err) {
        console.error("Error updating database chat messages for new topic:", err);
      }
    }
  };

  return (
    <LearningContext.Provider
      value={{
        studentMins,
        dailyGoal,
        studentName,
        studentGrade,
        activeSubject,
        activeChapter,
        activeTopic,
        percentComplete,
        weaknesses,
        chatMessages,
        addChatMessage,
        incrementStudyTime,
        updateProgress,
        submitQuizScore,
        resolveWeakness,
        resetChat,
        initializeChatForTopic,
        setActiveSubject,
        setActiveChapter,
        setActiveTopic,
        updateProfile
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider");
  }
  return context;
}
