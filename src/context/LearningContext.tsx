"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {useAISpeechLanguage} from "@/hooks/useAISpeechLanguage";

import { createClient } from "@/lib/supabase/client";
import { Message, Weakness } from "@/types/learning";
import { SubjectProficiency } from "@/types/progress";
import {
  initialChatMessages,
  mockWeaknesses,
} from "@/lib/mock/learning";

interface LearningContextType {
  studentMins: number;
  studentName: string;
  studentGrade: string;
  studentSchool: string;
  studentAge: number | "";
  studentTutorPersona: string;

  activeSubject: string;
  activeChapter: string;
  activeTopic: string;

  percentComplete: number;
  weaknesses: Weakness[];
  chatMessages: Message[];

  addChatMessage: (
    text: string,
    sender: "USER" | "AI"
  ) => void;

  incrementStudyTime: (mins: number) => void;
  updateProgress: (percent: number) => void;
  submitQuizScore: (score: number) => void;
  resetChat: () => void;

  initializeChatForTopic: (
    topicName: string,
    welcomeMsg: string
  ) => void;

  setActiveSubject: (subject: string) => void;
  setActiveChapter: (chapter: string) => void;
  setActiveTopic: (topic: string) => void;

  updateProfile: (
    name: string,
    grade: string,
    school: string,
    age: number | "",
    tutorPersona: string
  ) => Promise<void>;

  isAISpeaking: boolean;
  setIsAISpeaking: (isSpeaking: boolean) => void;

  activeAITranscription: string;
  setActiveAITranscription: (text: string) => void;

  subjectProficiencies: SubjectProficiency[];
}

type LocalQuizAttempt = {
  topic_id: string;
  score: number;
};

const baseScores = {
  Mathematics: 0,
  Science: 0,
  "Social Science": 0,
  English: 0,
};

const baseColors = {
  Mathematics: "bg-primary",
  Science: "bg-[#0ea5e9]",
  "Social Science": "bg-[#f59e0b]",
  English: "bg-[#10b981]",
};

const subjectNameMap: Record<string, string> = {
  "sub-math": "Mathematics",
  "sub-sci": "Science",
  "sub-hist": "Social Science",
  "sub-eng": "English",
};

function getSubjectForTopic(
  topicName: string
): string {
  const cleanTopic =
    topicName.trim().toLowerCase();

  if (
    cleanTopic.includes("fraction") ||
    cleanTopic.includes("number") ||
    cleanTopic.includes("addition") ||
    cleanTopic.includes("division")
  ) {
    return "sub-math";
  }

  if (
    cleanTopic.includes("photosynthesis") ||
    cleanTopic.includes("gravity") ||
    cleanTopic.includes("force") ||
    cleanTopic.includes("body") ||
    cleanTopic.includes("science")
  ) {
    return "sub-sci";
  }

  if (
    cleanTopic.includes("constitution") ||
    cleanTopic.includes("bagh") ||
    cleanTopic.includes("revolt") ||
    cleanTopic.includes("revolution") ||
    cleanTopic.includes("history")
  ) {
    return "sub-hist";
  }

  if (
    cleanTopic.includes("noun") ||
    cleanTopic.includes("verb") ||
    cleanTopic.includes("sentence") ||
    cleanTopic.includes("comma") ||
    cleanTopic.includes("word") ||
    cleanTopic.includes("english")
  ) {
    return "sub-eng";
  }

  return "sub-math";
}

function calculateProficiencies(
  attempts: LocalQuizAttempt[]
): SubjectProficiency[] {
  const subjectAttempts: Record<
    string,
    number[]
  > = {
    Mathematics: [],
    Science: [],
    "Social Science": [],
    English: [],
  };

  attempts.forEach((attempt) => {
    const subjectKey = getSubjectForTopic(
      attempt.topic_id
    );

    const subjectName =
      subjectNameMap[subjectKey];

    if (
      subjectName &&
      subjectAttempts[subjectName]
    ) {
      subjectAttempts[subjectName].push(
        Number(attempt.score)
      );
    }
  });

  return Object.keys(baseScores).map(
    (subjectName) => {
      const scores =
        subjectAttempts[subjectName];

      const average =
        scores.length > 0
          ? Math.round(
            scores.reduce(
              (sum, score) => sum + score,
              0
            ) / scores.length
          )
          : baseScores[
          subjectName as keyof typeof baseScores
          ];

      return {
        name: subjectName,
        score: average,
        colorClass:
          baseColors[
          subjectName as keyof typeof baseColors
          ],
      };
    }
  );
}

function parseGradeNumber(
  grade: string
): number | null {
  const match = grade.match(/\d+/);

  if (!match) {
    return null;
  }

  const gradeNumber = Number(match[0]);

  if (
    !Number.isInteger(gradeNumber) ||
    gradeNumber < 1 ||
    gradeNumber > 12
  ) {
    return null;
  }

  return gradeNumber;
}

function readLocalJson<T>(
  key: string,
  fallback: T
): T {
  try {
    const value = localStorage.getItem(key);

    return value
      ? (JSON.parse(value) as T)
      : fallback;
  } catch {
    return fallback;
  }
}

const LearningContext =
  createContext<
    LearningContextType | undefined
  >(undefined);

export function LearningProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {language: aiSpeechLanguage} = useAISpeechLanguage();
  /*
   * Browser Supabase client sirf ek baar
   * provider mount hone par create hoga.
   */
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [studentMins, setStudentMins] =
    useState(42);

  const [studentName, setStudentName] =
    useState("");

  const [studentGrade, setStudentGrade] =
    useState("");

  const [studentSchool, setStudentSchool] =
    useState("");

  const [studentAge, setStudentAge] =
    useState<number | "">("");

  const [
    studentTutorPersona,
    setStudentTutorPersona,
  ] = useState("Socratic");

  const [activeSubject, setActiveSubject] =
    useState("Mathematics");

  const [activeChapter, setActiveChapter] =
    useState("Chapter 4: Fractions");

  const [activeTopic, setActiveTopic] =
    useState("Mixed Numbers");

  const [
    percentComplete,
    setPercentComplete,
  ] = useState(65);

  const [weaknesses, setWeaknesses] =
    useState<Weakness[]>(mockWeaknesses);

  const [chatMessages, setChatMessages] =
    useState<Message[]>(
      initialChatMessages
    );

  const [
    isAISpeaking,
    setIsAISpeaking,
  ] = useState(false);

  const [
    activeAITranscription,
    setActiveAITranscription,
  ] = useState("");

  const [
    subjectProficiencies,
    setSubjectProficiencies,
  ] = useState<SubjectProficiency[]>(
    calculateProficiencies([])
  );

  /*
   * Abhi jin modules ki database tables nahi
   * bani hain, unka temporary local data load.
   */
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const savedMins =
      localStorage.getItem(
        "classorbit_mins"
      );

    if (savedMins) {
      setStudentMins(
        Number.parseInt(savedMins, 10)
      );
    }

    const savedProgress =
      localStorage.getItem(
        "classorbit_progress"
      );

    if (savedProgress) {
      setPercentComplete(
        Number.parseInt(savedProgress, 10)
      );
    }

    setChatMessages(
      readLocalJson<Message[]>(
        "classorbit_chat",
        initialChatMessages
      )
    );

    setWeaknesses(
      readLocalJson<Weakness[]>(
        "classorbit_weaknesses",
        mockWeaknesses
      )
    );

    const savedPersona =
      localStorage.getItem(
        "classorbit_persona"
      );

    if (savedPersona) {
      setStudentTutorPersona(savedPersona);
    }

    const attempts =
      readLocalJson<LocalQuizAttempt[]>(
        "classorbit_quiz_attempts",
        []
      );

    setSubjectProficiencies(
      calculateProficiencies(attempts)
    );
  }, []);

  /*
   * Supabase se sirf profile module load karein.
   * Pathname change par bhi load karenge agar profile set up ho chuki hai
   */
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        cancelled ||
        userError ||
        !user
      ) {
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("users")
        .select(
          `
            full_name,
            school,
            age,
            class_id
          `
        )
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) {
        return;
      }

      console.log("PROFILE DATA FETCHED:", profile, "ERROR:", profileError);

      if (profileError) {
        console.error(
          "Profile loading failed:",
          profileError
        );
        return;
      }

      /*
       * Profile absent ho to yahan automatically
       * create nahi karni. Callback/profile-setup
       * flow ise handle karega.
       */
      if (!profile) {
        console.warn("No profile found for user in 'users' table.");
        return;
      }

      setStudentName(profile.full_name || "");

      const classNumber = profile.class_id || 5;

      setStudentGrade(
        `Grade ${classNumber}`
      );

      setStudentSchool(
        profile.school ?? ""
      );

      setStudentAge(
        profile.age ?? 10
      );
    }

    if (pathname !== "/login" && pathname !== "/profile-setup") {
      void loadProfile();
    }

    return () => {
      cancelled = true;
    };
  }, [supabase, pathname]);

  /*
   * Sirf profiles table update hoti hai.
   *
   * tutor_persona abhi profiles schema mein
   * nahi hai, isliye temporarily localStorage
   * mein rahega.
   */
  const updateProfile = async (
    name: string,
    grade: string,
    school: string,
    age: number | "",
    tutorPersona: string
  ) => {
    const gradeNumber =
      parseGradeNumber(grade);

    if (!gradeNumber) {
      throw new Error(
        "Invalid grade selected."
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error(
        "You must be logged in to update your profile."
      );
    }

    const { error: updateError } =
      await supabase
        .from("users")
        .update({
          full_name: name.trim(),
          class_id: gradeNumber,
          school:
            school.trim() || null,
          age: age === "" ? null : age,
        })
        .eq("id", user.id);

    if (updateError) {
      throw new Error(
        updateError.message
      );
    }

    setStudentName(name.trim());
    setStudentGrade(
      `Grade ${gradeNumber}`
    );
    setStudentSchool(school.trim());
    setStudentAge(age);

    setStudentTutorPersona(
      tutorPersona
    );

    localStorage.setItem(
      "classorbit_persona",
      tutorPersona
    );
  };

  /*
   * Chat module abhi localStorage mein rahega.
   */
  const addChatMessage = async (
    text: string,
    sender: "USER" | "AI"
  ) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`,
      sender,
      text,
      createdAt:
        new Date().toISOString(),
    };

    setChatMessages((previous) => {
      const updated = [
        ...previous,
        newMessage,
      ];

      localStorage.setItem(
        "classorbit_chat",
        JSON.stringify(updated)
      );

      return updated;
    });

    if (sender !== "USER") {
      return;
    }

    try {
      const response = await fetch(
        "/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: text,
            preferredLanguage: aiSpeechLanguage,
            grade: studentGrade,
            chapter: activeChapter,
            conversationHistory: chatMessages
              .slice(-6)
              .map((message) => ({
                sender: message.sender,
                text: message.text,
              })),
            subject: activeSubject,
            topic: activeTopic,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "AI response request failed."
        );
      }

      const data = await response.json();

      const replyText =
        typeof data.text === "string"
          ? data.text
          : "I could not generate a response.";

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        sender: "AI",
        text: replyText,
        createdAt:
          new Date().toISOString(),
      };

      setChatMessages((previous) => {
        const updated = [
          ...previous,
          aiMessage,
        ];

        localStorage.setItem(
          "classorbit_chat",
          JSON.stringify(updated)
        );

        return updated;
      });
    } catch (error) {
      console.error(
        "AI response fetch error:",
        error
      );
    }
  };

  const incrementStudyTime = (
    mins: number
  ) => {
    setStudentMins((previous) => {
      const newMins = Math.min(
        previous + mins,
        180
      );

      localStorage.setItem(
        "classorbit_mins",
        String(newMins)
      );

      return newMins;
    });
  };

  const updateProgress = (
    percent: number
  ) => {
    const newPercent = Math.min(
      Math.max(percent, 0),
      100
    );

    setPercentComplete(newPercent);

    localStorage.setItem(
      "classorbit_progress",
      String(newPercent)
    );
  };

  const submitQuizScore = (
    score: number
  ) => {
    const attempts =
      readLocalJson<LocalQuizAttempt[]>(
        "classorbit_quiz_attempts",
        []
      );

    const updatedAttempts = [
      ...attempts,
      {
        topic_id: activeTopic,
        score,
      },
    ];

    localStorage.setItem(
      "classorbit_quiz_attempts",
      JSON.stringify(updatedAttempts)
    );

    setSubjectProficiencies(
      calculateProficiencies(
        updatedAttempts
      )
    );

    if (score >= 80) {
      setWeaknesses((previous) => {
        const updated = previous.map(
          (weakness) => {
            if (
              weakness.skillName ===
              "Dividing Mixed Numbers"
            ) {
              return {
                ...weakness,
                score: Math.min(
                  weakness.score + 0.2,
                  1
                ),
                notes:
                  "Progressing well! Gaps are closing.",
              };
            }

            return weakness;
          }
        );

        localStorage.setItem(
          "classorbit_weaknesses",
          JSON.stringify(updated)
        );

        return updated;
      });

      updateProgress(
        percentComplete + 10
      );
    }
  };


  const resetChat = () => {
    setChatMessages(
      initialChatMessages
    );

    localStorage.removeItem(
      "classorbit_chat"
    );
  };

  const initializeChatForTopic = (
    topicName: string,
    welcomeMsg: string
  ) => {
    const messages: Message[] = [
      {
        id: `msg-init-${Date.now()}`,
        sender: "AI",
        text: welcomeMsg,
        createdAt:
          new Date().toISOString(),
      },
    ];

    setActiveTopic(topicName);
    setChatMessages(messages);

    localStorage.setItem(
      "classorbit_chat",
      JSON.stringify(messages)
    );
  };

  return (
    <LearningContext.Provider
      value={{
        studentMins,
        studentName,
        studentGrade,
        studentSchool,
        studentAge,
        studentTutorPersona,

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
        resetChat,
        initializeChatForTopic,

        setActiveSubject,
        setActiveChapter,
        setActiveTopic,

        updateProfile,

        isAISpeaking,
        setIsAISpeaking,

        activeAITranscription,
        setActiveAITranscription,

        subjectProficiencies,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context =
    useContext(LearningContext);

  if (!context) {
    throw new Error(
      "useLearning must be used within a LearningProvider"
    );
  }

  return context;
}
