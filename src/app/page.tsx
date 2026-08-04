"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// FAQ Data Setup
const FAQ_ITEMS = [
  {
    question: "What is ClassOrbit and how does it help students?",
    answer: "ClassOrbit is an AI-powered Socratic learning companion designed for students in Grades 1-8. Instead of just giving students direct answers, ClassOrbit features Maya—a voice-enabled tutor who guides students step-by-step using helpful hints, promoting deep conceptual understanding."
  },
  {
    question: "What is the Socratic method of learning?",
    answer: "The Socratic method focuses on cooperative dialogue. Maya asks guiding questions and provides scaffolds (clues) rather than direct solutions. This prompts students to active-recall concepts and figure out the answers themselves, which drastically improves long-term memory retention."
  },
  {
    question: "Which subjects and grades are supported?",
    answer: "We support major subjects for Grades 1 through 8, including Mathematics, Science, English, Environmental Studies (EVS), and Hindi. The content dynamically adapts to the student's active school curriculum grade."
  },
  {
    question: "Can Maya understand and speak in regional languages?",
    answer: "Yes! ClassOrbit includes native support for multilingual translation. Maya can speak and transcribe in Hindi (हिन्दी), Bengali (বাংলা), Tamil (தமிழ்), Telugu (తెలుగు), Gujarati (ગુજરાતી), and more, allowing students to learn in the language they are most comfortable with."
  },
  {
    question: "Is there prerequisite checking for chapters?",
    answer: "Absolutely. Before starting any new chapter, ClassOrbit administers a brief diagnostic checkpoint. If a student shows gaps in prerequisite knowledge, Maya recommends a tailored recovery path. If they pass, they instantly unlock the advanced chapter syllabus."
  },
  {
    question: "Can parents monitor their child's progress?",
    answer: "Yes. Parents get access to a centralized performance history dashboard which logs diagnostic checks, subject mastery stats, topic-by-topic completion rates, and historical logs with detailed feedback analysis."
  }
];

// Interactive Socratic Simulator Data
type SimMessage = {
  sender: "student" | "traditional" | "maya";
  text: string;
  options?: string[];
};

const SIMULATOR_QUESTIONS = [
  {
    id: "math",
    label: "🔢 Math: Solve 7x - 4 = 17",
    studentQuery: "Help me solve: 7x - 4 = 17",
    traditionalResponse: "To solve for x:\n1. Add 4 to both sides: 7x = 21\n2. Divide both sides by 7: x = 21 / 7 = 3\n\nTherefore, x = 3.",
    socraticSteps: [
      {
        text: "Let's solve this together! 😊 First, we want to isolate the 'x' term. We have a '- 4' on the left side. What is the opposite of subtraction that we can apply to cancel it out?",
        options: ["Add 4 to both sides", "Subtract 4 from both sides"]
      },
      {
        // Path when user chooses option index 0 ("Add 4 to both sides")
        text: "Awesome choice! 🎉 Adding 4 to both sides gives us:\n7x = 21\n\nNow, 7 is multiplied by x. What is the opposite operation of multiplication that we should use to get x by itself?",
        options: ["Divide both sides by 7", "Multiply both sides by 7"]
      },
      {
        // Path when user chooses option index 0 ("Divide both sides by 7")
        text: "Spot on! 🌟 Dividing both sides by 7 gives us:\nx = 21 / 7, which simplified is x = 3.\n\nGreat job! You solved it Socratic style! How do you feel about this step?",
        options: [] // End
      }
    ],
    socraticErrorStep: {
      text: "Oops! If we subtract 4, we get 7x - 8 = 13, which makes it more complicated. Let's try addition instead to cancel out the minus! What should we add?",
      options: ["Add 4 to both sides"]
    }
  },
  {
    id: "science",
    label: "☁️ Science: Why is the sky blue?",
    studentQuery: "Why is the sky blue?",
    traditionalResponse: "The sky is blue due to Rayleigh scattering. Solar radiation is scattered by gases in the atmosphere. Because blue light travels as shorter, smaller waves, it is scattered more than other colors, making the sky appear blue.",
    socraticSteps: [
      {
        text: "Great question! ⛅ Let's think about light. Sunlight looks white, but it's actually made of a rainbow of colors. Red waves are very long, while blue waves are short and choppy. When sunlight hits gas particles in our atmosphere, which waves do you think will bounce off (scatter) more easily—the long red ones or the short choppy blue ones?",
        options: ["The short, choppy blue waves", "The long, smooth red waves"]
      },
      {
        text: "Exactly right! 💙 The short blue waves bounce off the air molecules in every direction. This scattering is what fills our eyes when we look up. What color do you think we would see if our atmosphere had no air molecules at all to scatter light?",
        options: ["Black (like space)", "White"]
      },
      {
        text: "Perfect! 🌌 Without an atmosphere to scatter light, the sky would look black, just like in deep space! You've got a great scientific mind! What other wonders should we explore?",
        options: []
      }
    ],
    socraticErrorStep: {
      text: "Actually, think of a large wave rolling over a tiny pebble vs a tiny wave bouncing off it. The long, smooth red waves mostly pass right through the atmosphere without bouncing. Let's try picking the other wave type!",
      options: ["The short, choppy blue waves"]
    }
  }
];

const CURRICULUM_DATA = {
  primary: [
    {
      subject: "🔢 Mathematics",
      progress: 90,
      status: "Active",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      chapters: [
        { name: "Numbers & Counting", completed: true, badge: "Mastered ✅" },
        { name: "Shapes & Basic Geometry", completed: true, badge: "Mastered ✅" },
        { name: "Intro to Addition & Subtraction", completed: false, badge: "Unlocked 🔓" },
        { name: "Measurement Basics", completed: false, badge: "🔒 Locked - Diagnostic Required" }
      ]
    },
    {
      subject: "🌱 Environmental Studies (EVS)",
      progress: 60,
      status: "Active",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      chapters: [
        { name: "My Family & Neighborhood", completed: true, badge: "Mastered ✅" },
        { name: "Plants Around Us", completed: false, badge: "In Progress 📖" },
        { name: "Animals & Habitats", completed: false, badge: "🔒 Locked - Prereq Gap" },
        { name: "Water Cycle basics", completed: false, badge: "🔒 Locked - Prereq Gap" }
      ]
    },
    {
      subject: "📚 English Grammar",
      progress: 100,
      status: "Syllabus Mastered",
      statusColor: "text-primary bg-primary/8 border-primary/15",
      chapters: [
        { name: "Alphabet & Phonetics", completed: true, badge: "Mastered ✅" },
        { name: "Nouns & Pronouns", completed: true, badge: "Mastered ✅" },
        { name: "Vowels & Simple Sentences", completed: true, badge: "Mastered ✅" }
      ]
    }
  ],
  middle: [
    {
      subject: "🔢 Mathematics",
      progress: 75,
      status: "Active",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      chapters: [
        { name: "Linear Expressions & Equations", completed: true, badge: "Mastered ✅" },
        { name: "Fractions & Decimals Review", completed: true, badge: "Mastered ✅" },
        { name: "Ratios & Proportions", completed: false, badge: "In Progress 📖" },
        { name: "Symmetric Geometry Basics", completed: false, badge: "🔒 Locked - Diagnostic Required" }
      ]
    },
    {
      subject: "🔬 Science (Physics & Chemistry)",
      progress: 40,
      status: "Active",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      chapters: [
        { name: "Cell Structure & Microscope", completed: true, badge: "Mastered ✅" },
        { name: "Light Reflection & Shadows", completed: false, badge: "🔒 Recovery - Gap Found in Pre-Optics" },
        { name: "Electricity & Circuits", completed: false, badge: "🔒 Locked" },
        { name: "Acids, Bases & Salts", completed: false, badge: "🔒 Locked" }
      ]
    },
    {
      subject: "✍️ English Literature",
      progress: 80,
      status: "Active",
      statusColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      chapters: [
        { name: "Sentence Structures", completed: true, badge: "Mastered ✅" },
        { name: "Direct & Indirect Speech", completed: true, badge: "Mastered ✅" },
        { name: "Creative Composition Writing", completed: false, badge: "Unlocked 🔓" }
      ]
    }
  ]
};

const PERSONA_DATA = {
  socratic: {
    title: "Maya - Socratic Hints (Default)",
    description: "Guides step-by-step with scaffolded clues. Maya doesn't just hand over the solution; she asks diagnostic hints to spark self-discovery.",
    avatarIcon: "auto_awesome",
    avatarBg: "bg-primary",
    waveColor: "bg-primary",
    waveHeights: ["h-5", "h-8", "h-11", "h-6", "h-9", "h-7", "h-4"],
    waveSpeed: "animate-mini-voice-1",
    dialogue: "Standard Question: 'Why is water wet?'\n\nMaya Socratic: \"Let's explore this together! 💧 What happens when you pour water? It sticks to your skin, right? Why do you think water molecules cling so strongly to surfaces?\""
  },
  explainer: {
    title: "Direct Explainer",
    description: "Direct conceptual answers and calculations. Ideal for fast reviews or high-school students looking for instant formula derivations.",
    avatarIcon: "school",
    avatarBg: "bg-emerald-600",
    waveColor: "bg-emerald-500",
    waveHeights: ["h-3", "h-5", "h-4", "h-3", "h-6", "h-4", "h-2"],
    waveSpeed: "animate-mini-voice-2",
    dialogue: "Standard Question: 'Why is water wet?'\n\nDirect Explainer: \"Water is wet because of strong cohesive forces. The water molecules adhere to surfaces, generating adhesive molecular attraction that wet objects upon contact.\""
  },
  friendly: {
    title: "Friendly Companion",
    description: "Analogies, fun stories, and easy-to-digest real-world explanations. Perfect for younger elementary grade learners.",
    avatarIcon: "sentiment_satisfied",
    avatarBg: "bg-amber-500",
    waveColor: "bg-amber-400",
    waveHeights: ["h-6", "h-11", "h-14", "h-9", "h-12", "h-10", "h-5"],
    waveSpeed: "animate-mini-voice-4",
    dialogue: "Standard Question: 'Why is water wet?'\n\nFriendly Companion: \"Think of water molecules as a bunch of tiny friends holding hands super tightly! 🤝 They love to stick to you like a warm group hug, which is why it feels wet!\""
  }
};

function StarfieldCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // Track mouse coordinates
    let mx = -1000;
    let my = -1000;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mx = -1000;
      my = -1000;
    };
    const parent = canvas.parentElement;
    parent?.addEventListener("mousemove", handleMouseMove);
    parent?.addEventListener("mouseleave", handleMouseLeave);

    // Star particles setup
    const particleCount = 75;
    const particles = Array.from({ length: particleCount }).map(() => {
      const isBright = Math.random() > 0.7;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: isBright ? Math.random() * 2 + 1.2 : Math.random() * 1.2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        color: isBright
          ? "rgba(83, 65, 205, 0.4)"
          : Math.random() > 0.5
            ? "rgba(107, 56, 212, 0.25)"
            : "rgba(255, 94, 126, 0.2)",
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 90 + 30,
        orbitSpeed: (Math.random() - 0.5) * 0.015
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mx > -500 && my > -500) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            p.x += (dx / dist) * 0.65;
            p.y += (dy / dist) * 0.65;

            p.angle += p.orbitSpeed;
            p.x += Math.cos(p.angle) * 0.35;
            p.y += Math.sin(p.angle) * 0.35;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      parent?.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

export default function LandingPage() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Advanced Interactive States
  const [activeGradeGroup, setActiveGradeGroup] = useState<"primary" | "middle">("middle");
  const [activePersona, setActivePersona] = useState<"socratic" | "explainer" | "friendly">("socratic");
  const [activeParentTab, setActiveParentTab] = useState<"diagnostic" | "mastery" | "logs">("diagnostic");
  const [mayaSparkle, setMayaSparkle] = useState(false);

  // FAQ Accordion State
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Socratic Simulator State
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState(0);
  const [simulatorMode, setSimulatorMode] = useState<"socratic" | "traditional">("socratic");
  const [simStep, setSimStep] = useState(0);
  const [simHistory, setSimHistory] = useState<SimMessage[]>([]);
  const [isSimTyping, setIsSimTyping] = useState(false);

  // Dynamic Auth State Retrieval
  useEffect(() => {
    async function checkUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsLoggedIn(true);
          router.replace("/dashboard");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setCheckingAuth(false);
      }
    }
    checkUser();
  }, [router]);

  // Initialize Simulator when question or mode changes
  useEffect(() => {
    resetSimulator();
  }, [selectedQuestionIdx, simulatorMode]);

  const resetSimulator = () => {
    const question = SIMULATOR_QUESTIONS[selectedQuestionIdx];
    if (simulatorMode === "traditional") {
      setSimHistory([
        { sender: "student", text: question.studentQuery },
        { sender: "traditional", text: question.traditionalResponse }
      ]);
      setSimStep(0);
    } else {
      setSimHistory([
        { sender: "student", text: question.studentQuery },
        { sender: "maya", text: question.socraticSteps[0].text, options: question.socraticSteps[0].options }
      ]);
      setSimStep(0);
    }
    setIsSimTyping(false);
  };

  const handleSocraticOption = (optionText: string) => {
    if (isSimTyping) return;

    // 1. Add student message to history
    const updatedHistory = [...simHistory, { sender: "student" as const, text: optionText }];
    setSimHistory(updatedHistory);
    setIsSimTyping(true);

    // 2. Determine next step
    setTimeout(() => {
      const question = SIMULATOR_QUESTIONS[selectedQuestionIdx];
      let nextStepIndex = simStep;
      let nextMsgText = "";
      let nextOptions: string[] = [];

      // Logic for Math Question
      if (question.id === "math") {
        if (optionText === "Add 4 to both sides") {
          nextStepIndex = 1;
          nextMsgText = question.socraticSteps[1].text;
          nextOptions = question.socraticSteps[1].options || [];
        } else if (optionText === "Subtract 4 from both sides") {
          // Send them to error step which prompts "Add 4 to both sides"
          nextStepIndex = 0; // keeps them on step 0 loop
          nextMsgText = question.socraticErrorStep.text;
          nextOptions = question.socraticErrorStep.options;
        } else if (optionText === "Divide both sides by 7") {
          nextStepIndex = 2;
          nextMsgText = question.socraticSteps[2].text;
          nextOptions = [];
        } else if (optionText === "Multiply both sides by 7") {
          nextStepIndex = 1; // keeps them on step 1
          nextMsgText = "If we multiply, we get 49x = 147, which makes x harder to find! We want to do the opposite of multiplication to isolate x. Let's try dividing instead!";
          nextOptions = ["Divide both sides by 7"];
        }
      }
      // Logic for Science Question
      else {
        if (optionText === "The short, choppy blue waves") {
          nextStepIndex = 1;
          nextMsgText = question.socraticSteps[1].text;
          nextOptions = question.socraticSteps[1].options || [];
        } else if (optionText === "The long, smooth red waves") {
          nextStepIndex = 0;
          nextMsgText = question.socraticErrorStep.text;
          nextOptions = question.socraticErrorStep.options;
        } else if (optionText === "Black (like space)") {
          nextStepIndex = 2;
          nextMsgText = question.socraticSteps[2].text;
          nextOptions = [];
        } else if (optionText === "White") {
          nextStepIndex = 1;
          nextMsgText = "Without an atmosphere, there are no particles to redirect light in any direction. It would be total emptiness! What color does emptiness look like in space?";
          nextOptions = ["Black (like space)"];
        }
      }

      setSimStep(nextStepIndex);
      setSimHistory(prev => [
        ...prev,
        { sender: "maya" as const, text: nextMsgText, options: nextOptions }
      ]);
      setIsSimTyping(false);
    }, 1000);
  };

  const handleCTA = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const playChime = () => {
    setMayaSparkle(true);
    setTimeout(() => setMayaSparkle(false), 600);

    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880.00, now + 0.1); // A5
      gain2.gain.setValueAtTime(0.12, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.4);
      osc2.start(now + 0.1);
      osc2.stop(now + 0.5);
    } catch (err) {
      console.warn("Web Audio chime blocked:", err);
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-background text-slate-800 min-h-screen w-full flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-[22px] bg-primary flex items-center justify-center animate-pulse shadow-[0_8px_24px_rgba(83,65,205,0.25)]">
            <span className="material-symbols-outlined text-white text-[24px]">auto_awesome</span>
          </div>
          <span className="text-xs font-bold text-slate-400 animate-pulse">Initializing ClassOrbit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-[#121c2a] min-h-screen w-full flex flex-col font-sans selection:bg-primary/20 selection:text-primary">

      {/* 1. STICKY NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-xl border-b border-slate-100/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center ambient-bloom shadow-[0_4px_14px_rgba(83,65,205,0.25)]">
              <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="font-display font-bold text-lg text-primary tracking-tight">ClassOrbit</span>
          </div>

          {/* Desktop Navigation Link anchors */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/60 border border-slate-200/40 p-1 rounded-full shadow-2xs">
            <a 
              href="#features" 
              onClick={(e) => handleScrollTo(e, "features")} 
              className="py-1.5 px-4 text-xs font-bold text-slate-600 hover:text-primary rounded-full hover:bg-white hover:shadow-2xs transition-all duration-300"
            >
              Features
            </a>
            <a 
              href="#socratic-method" 
              onClick={(e) => handleScrollTo(e, "socratic-method")} 
              className="py-1.5 px-4 text-xs font-bold text-slate-600 hover:text-primary rounded-full hover:bg-white hover:shadow-2xs transition-all duration-300"
            >
              Socratic Approach
            </a>
            <a 
              href="#maya-voice" 
              onClick={(e) => handleScrollTo(e, "maya-voice")} 
              className="py-1.5 px-4 text-xs font-bold text-slate-600 hover:text-primary rounded-full hover:bg-white hover:shadow-2xs transition-all duration-300"
            >
              Maya AI
            </a>
            <a 
              href="#faq" 
              onClick={(e) => handleScrollTo(e, "faq")} 
              className="py-1.5 px-4 text-xs font-bold text-slate-600 hover:text-primary rounded-full hover:bg-white hover:shadow-2xs transition-all duration-300"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTA Button */}
          <div className="flex items-center gap-3">
            {!checkingAuth && (
              <button
                onClick={handleCTA}
                className="h-10 px-5 bg-primary hover:bg-secondary text-white text-xs font-bold rounded-full transition-all duration-300 shadow-[0_4px_12px_rgba(83,65,205,0.25)] hover:shadow-[0_6px_20px_rgba(83,65,205,0.35)] hover:-translate-y-0.5 cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                {isLoggedIn ? (
                  <>
                    Go to Dashboard
                    <span className="material-symbols-outlined text-[16px]">space_dashboard</span>
                  </>
                ) : (
                  <>
                    Get Started Free
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. PREMIUM HERO SECTION */}
      <section className="relative w-full bg-white pt-4 pb-24 overflow-hidden px-6">
        {/* Dynamic Starfield Canvas Backdrop */}
        <StarfieldCanvas />

        {/* CSS Keyframes for gradient flow and customized pulse effects */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-flow {
            background-size: 200% auto;
            animation: gradientFlow 6s ease infinite;
          }
        `}} />

        {/* Background ambient light blur blobs */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-secondary/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 relative z-10">
          {/* 1. Video Showcase at the Top */}
          <div className="w-full flex items-center justify-center stagger-2 mt-0 mb-2">
            <video
              src="/hero.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-[800px] h-auto select-none mix-blend-multiply"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent), linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
                maskImage: 'linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent), linear-gradient(to bottom, transparent, black 20px, black calc(100% - 20px), transparent)',
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect'
              }}
            />
          </div>

          {/* 2. Interactive Heading Card below the video */}
          <div className="stagger-1 group cursor-default select-none py-4 px-6 rounded-3xl bg-slate-50/40 hover:bg-slate-50 border border-transparent hover:border-slate-100 hover:shadow-[0_20px_50px_rgba(83,65,205,0.06)] transition-all duration-500 max-w-3xl mx-auto">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight leading-tight transition-transform duration-500 group-hover:scale-[1.01]">
              Sparking{" "}
              <span className="relative inline-block text-primary">
                Curiosity
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-full rounded-full" />
              </span>
              . Personalizing{" "}
              <span className="relative inline-block text-secondary">
                Mastery
                <span className="absolute bottom-0 left-0 w-0 h-[3px] bg-gradient-to-r from-secondary to-pink-500 transition-all duration-500 group-hover:w-full rounded-full" />
              </span>
              .
            </h1>
          </div>

          {/* 3. CTAs below the heading */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto stagger-3">
            <button
              onClick={handleCTA}
              className="w-full sm:w-auto h-12 px-8 bg-primary hover:bg-secondary text-white text-sm font-bold rounded-full transition-all duration-300 shadow-[0_6px_20px_rgba(83,65,205,0.25)] hover:shadow-[0_8px_24px_rgba(83,65,205,0.35)] hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Start Learning Free
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
            </button>
            <a
              href="#socratic-method"
              onClick={(e) => handleScrollTo(e, "socratic-method")}
              className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-slate-50 text-slate-800 hover:text-primary text-sm font-bold rounded-full transition-all duration-300 border border-slate-200/80 shadow-xs flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:scale-95"
            >
              Interactive Demo
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
            </a>
          </div>

          {/* 4. Trust Metrics at the very bottom */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200/60 w-full max-w-2xl mx-auto stagger-3">
            <div className="space-y-1">
              <div className="font-display font-extrabold text-2xl text-primary">1–8</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Grades Supported</div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-2xl text-primary">Socratic</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Tutoring Model</div>
            </div>
            <div className="space-y-1">
              <div className="font-display font-extrabold text-2xl text-primary">6+</div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Indic Languages</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SOCRATIC SIMULATOR */}
      <section id="socratic-method" className="py-24 bg-white border-y border-slate-100 px-6 scroll-mt-16">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Interactive Comparison</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Socratic Guide vs. Standard Answers
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              Standard AIs just spit out the solution, leading to zero student recall. ClassOrbit&apos;s Socratic engine prompts students to solve it themselves through guided dialogue. Check it out below:
            </p>
          </div>

          {/* Simulator Wrapper Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">

            {/* Left Box: Controls & Topic Selectors */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Question</div>
                <div className="flex flex-col gap-2.5">
                  {SIMULATOR_QUESTIONS.map((q, idx) => (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuestionIdx(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${selectedQuestionIdx === idx
                          ? "bg-white border-primary/20 text-primary shadow-xs"
                          : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode Toggle Tabs */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tutoring Method</div>
                <div className="bg-slate-200/60 p-1.5 rounded-2xl flex gap-1 border border-slate-200/10">
                  <button
                    onClick={() => setSimulatorMode("socratic")}
                    className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${simulatorMode === "socratic"
                        ? "bg-white text-primary shadow-xs"
                        : "bg-transparent text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Maya Socratic
                  </button>
                  <button
                    onClick={() => setSimulatorMode("traditional")}
                    className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${simulatorMode === "traditional"
                        ? "bg-white text-primary shadow-xs"
                        : "bg-transparent text-slate-600 hover:text-slate-900"
                      }`}
                  >
                    Traditional AI
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Visual Chat Interface */}
            <div className="lg:col-span-8 bg-slate-950 text-white rounded-3xl p-6 shadow-xl border border-slate-900 flex flex-col justify-between min-h-[380px] relative overflow-hidden">

              {/* Background ambient shine */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Chat Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4 z-10">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${simulatorMode === "socratic" ? "bg-primary text-white" : "bg-slate-700 text-slate-300"
                    }`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {simulatorMode === "socratic" ? "auto_awesome" : "smart_toy"}
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold">
                      {simulatorMode === "socratic" ? "Maya Socratic AI" : "Generic Chatbot"}
                    </div>
                    <div className="text-[9px] font-semibold text-slate-400">
                      {simulatorMode === "socratic" ? "Guiding Step-by-Step" : "Instant direct solution"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={resetSimulator}
                  className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Reset Simulator"
                >
                  <span className="material-symbols-outlined text-[15px]">replay</span>
                </button>
              </div>

              {/* Chat History Messages Container */}
              <div className="flex-1 space-y-3 overflow-y-auto pr-1 select-none z-10 custom-mini-scrollbar">
                {simHistory.map((msg, idx) => {
                  const isUser = msg.sender === "student";
                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                    >
                      {/* Avatar */}
                      {!isUser && (
                        <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[14px] border ${msg.sender === "maya" ? "bg-primary/20 border-primary/40 text-primary-fixed" : "bg-slate-800 border-slate-700 text-slate-400"
                          }`}>
                          <span className="material-symbols-outlined text-[14px]">
                            {msg.sender === "maya" ? "face" : "smart_toy"}
                          </span>
                        </div>
                      )}

                      {/* Bubble */}
                      <div className={`rounded-2xl p-3.5 text-xs font-semibold leading-relaxed whitespace-pre-line ${isUser
                          ? "bg-primary text-white rounded-tr-none"
                          : msg.sender === "maya"
                            ? "bg-slate-900 text-slate-100 border border-slate-800 rounded-tl-none"
                            : "bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-none"
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {/* Simulated typing indicator */}
                {isSimTyping && (
                  <div className="flex gap-3 mr-auto items-center">
                    <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-fixed">
                      <span className="material-symbols-outlined text-[14px]">face</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 flex items-center gap-1.5">
                      <span className="typing-dot typing-dot-1" />
                      <span className="typing-dot typing-dot-2" />
                      <span className="typing-dot typing-dot-3" />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Footer: Options Selector Chips */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 z-10">
                {simulatorMode === "socratic" ? (
                  <div className="space-y-2">
                    {/* Render Choices if available */}
                    {simHistory[simHistory.length - 1]?.options &&
                      simHistory[simHistory.length - 1]?.options!.length > 0 ? (
                      <>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 text-center sm:text-left">
                          Choose student response clue:
                        </div>
                        <div className="flex flex-wrap gap-2.5 justify-center sm:justify-start">
                          {simHistory[simHistory.length - 1].options!.map((opt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSocraticOption(opt)}
                              disabled={isSimTyping}
                              className="px-4 py-2 bg-primary/10 hover:bg-primary/25 border border-primary/30 text-primary-fixed text-xs font-bold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <button
                          onClick={resetSimulator}
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer"
                        >
                          🔄 Try Again / Reset Lesson
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-1 text-[11px] text-slate-500 font-semibold italic">
                    Traditional AI bypasses dialogue, leaving no cognitive footprints.
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE GRADE & SYLLABUS EXPLORER */}
      <section id="syllabus-explorer" className="py-24 bg-background px-6 border-b border-slate-100/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Curriculum Syllabus</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Adaptive Learning &amp; Chapters Explorer
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              Explore how ClassOrbit organizes chapters for different grades. Gaps in prerequisite knowledge lock advanced chapters and route students to custom recovery lessons.
            </p>
          </div>

          {/* Grade Toggles */}
          <div className="flex justify-center gap-3">
            {(["primary", "middle"] as const).map((group) => (
              <button
                key={group}
                onClick={() => setActiveGradeGroup(group)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${activeGradeGroup === group
                    ? "bg-primary text-white border-primary shadow-md hover:-translate-y-0.5"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:-translate-y-0.5"
                  }`}
              >
                {group === "primary" ? "Elementary (Grades 1-5)" : "Middle (Grades 6-8)"}
              </button>
            ))}
          </div>

          {/* Curriculum Display Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4">
            {CURRICULUM_DATA[activeGradeGroup].map((course, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-[28px] border border-slate-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-display font-extrabold text-base text-slate-800">{course.subject}</h3>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${course.statusColor}`}>
                      {course.status}
                    </span>
                  </div>

                  {/* Circular/Linear progress simulation */}
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Course Completion</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>

                  {/* Syllabus chapters list */}
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Roadmap Chapters</span>
                    <ul className="space-y-2.5">
                      {course.chapters.map((ch, cIdx) => (
                        <li key={cIdx} className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span className="truncate pr-2">{cIdx + 1}. {ch.name}</span>
                          <span className={`text-[8px] font-bold shrink-0 px-2 py-0.5 rounded-md ${ch.completed
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : ch.badge.includes("🔒")
                                ? "bg-slate-50 text-slate-400 border border-slate-100"
                                : "bg-primary/5 text-primary border border-primary/10"
                            }`}>
                            {ch.badge}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 mt-6 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400">Prerequisites Gate: Active</span>
                  <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. DYNAMIC FEATURES GRID */}
      <section id="features" className="py-24 bg-background px-6 scroll-mt-16">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Robust System Ecosystem</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Everything Students Need to Master Syllabus
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              Designed from the ground up for CBSE/ICSE curriculum and cognitive scaffolding. Here is what makes ClassOrbit state-of-the-art.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Card 1: Maya Voice Companion */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center text-primary group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">speech_to_text</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Voice-to-Text Speaking Avatar</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Real-time client speech captioning matches student queries. Maya responds using voice synthesis synced to active speech animation buffers.
                </p>
              </div>
              <div className="text-xs font-bold text-primary mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Listen &amp; Speak Native <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

            {/* Card 2: Concept Diagnostics */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">troubleshoot</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Adaptive Prerequisite Testing</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Diagnostic checks verify prior knowledge of students. Gaps route learners to target recovery steps, keeping advanced topics locked until base blocks are firm.
                </p>
              </div>
              <div className="text-xs font-bold text-amber-600 mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Explore Diagnostic Verification <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

            {/* Card 3: Personas Customization */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">psychology_alt</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Custom AI Tutor Personas</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Choose from Socratic Hints, Direct Explainer, or Friendly Companion personas. Adjust prompts on the fly based on student tone preferences.
                </p>
              </div>
              <div className="text-xs font-bold text-emerald-600 mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Customize AI Tone Persona <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

            {/* Card 4: Performance Logs */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">bar_chart_4_bars</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Performance Log Dashboard</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Session scores, prerequisite checks, and mastery reports are compiled into a centralized history card with detailed visual analysis.
                </p>
              </div>
              <div className="text-xs font-bold text-purple-600 mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Check Progress Logs <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

            {/* Card 5: Notes & Lightbox */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">sticky_note_2</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Workspace Study Notes</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  A dedicated side navigation panel displays chapter summary notes. Images open in a spring-animated full-screen backdrop lightbox modal.
                </p>
              </div>
              <div className="text-xs font-bold text-sky-600 mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Open Animated Lightbox <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

            {/* Card 6: YouTube Homework Links */}
            <div className="bg-white p-8 rounded-[28px] border border-slate-100 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(83,65,205,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 group-hover:scale-110 transition-all duration-300">
                  <span className="material-symbols-outlined text-[24px]">video_library</span>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">Video Link Sharing</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Curated study links based on the active topic are automatically generated with clipboard copy features and active status alerts.
                </p>
              </div>
              <div className="text-xs font-bold text-red-600 mt-6 group-hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1">
                Explore Link Systems <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE PARENT PROGRESS DASHBOARD MOCKUP */}
      <section id="parent-dashboard" className="py-24 bg-white border-b border-slate-100 px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Parent Monitoring</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Interactive Parent Progress Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              Monitor diagnostic checks, chapter mastery levels, and daily study consistency logs. Tap the tabs below to preview the live parent view:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">
            {/* Left side info points */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-2">
                <h3 className="font-display font-extrabold text-xl text-slate-900">Real-time Safety &amp; Analytics</h3>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Parents receive instant reports on syllabus checkpoints. Maya monitors learning patterns to catch and flag concept blockages automatically.
                </p>
              </div>

              {/* Tab Selector Buttons */}
              <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-2.5xl border border-slate-100">
                {(["diagnostic", "mastery", "logs"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveParentTab(tab)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${activeParentTab === tab
                        ? "bg-white border-primary/20 text-primary shadow-xs"
                        : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    {tab === "diagnostic" ? "📊 Diagnostic Checkpoints" : tab === "mastery" ? "📈 Concept Mastery Stats" : "📅 Study Activity Logs"}
                  </button>
                ))}
              </div>
            </div>

            {/* Right side mockup panel */}
            <div className="lg:col-span-8 bg-background border border-slate-200/80 rounded-3xl p-6 shadow-md min-h-[320px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ClassOrbit Parent Panel</span>
                  </div>
                  <span className="text-[9px] font-extrabold text-primary bg-primary/8 px-2 py-0.5 rounded-full">Student: Aarav Sharma (Grade 8)</span>
                </div>

                {/* Tab content rendering */}
                {activeParentTab === "diagnostic" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-xs font-bold text-slate-800 mb-2">Recent Chapter Pre-requisite Checks</div>
                    <div className="space-y-3">
                      {/* Log Row 1 */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-600 font-extrabold">
                            <span className="material-symbols-outlined text-[18px]">warning</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Chapter: Linear Equations</div>
                            <div className="text-[9px] font-semibold text-slate-400">Diagnostic Check: Gaps Found in Pre-Algebra</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">Recovery Assigned</span>
                          <div className="text-[7px] text-slate-400 font-semibold mt-1">July 28, 2026</div>
                        </div>
                      </div>

                      {/* Log Row 2 */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-extrabold">
                            <span className="material-symbols-outlined text-[18px]">verified</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">Chapter: Rational Numbers</div>
                            <div className="text-[9px] font-semibold text-slate-400">Diagnostic Check: Passed (Syllabus Unlocked)</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-display">Passed</span>
                          <div className="text-[7px] text-slate-400 font-semibold mt-1">July 25, 2026</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeParentTab === "mastery" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-xs font-bold text-slate-800 mb-2">Subject Learning Mastery Levels</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Subject 1 */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-500 font-sans">Mathematics</span>
                          <span className="text-[10px] font-bold text-primary">82%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "82%" }} />
                        </div>
                      </div>
                      {/* Subject 2 */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-500 font-sans">Science</span>
                          <span className="text-[10px] font-bold text-purple-600">90%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-600 rounded-full" style={{ width: "90%" }} />
                        </div>
                      </div>
                      {/* Subject 3 */}
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col justify-between gap-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-slate-500 font-sans">English</span>
                          <span className="text-[10px] font-bold text-emerald-600">64%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: "64%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeParentTab === "logs" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-xs font-bold text-slate-800 mb-2">Aarav&apos;s Weekly Activity Logs</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-600">Thu, July 30</span>
                        <span className="font-bold text-slate-800">45 Mins Socratic dialogue on &quot;Fractions&quot;</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-600">Wed, July 29</span>
                        <span className="font-bold text-slate-800">Passed Chapter-End Test on Algebra (Score: 88%)</span>
                      </div>
                      <div className="flex items-center justify-between text-xs p-2 bg-white rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-600">Tue, July 28</span>
                        <span className="font-bold text-slate-800">Opened &quot;Introduction to Cell Biology&quot; with Maya</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              <div className="mt-6 pt-3.5 border-t border-slate-200/60 flex items-center justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                <span>Updated 2 minutes ago</span>
                <span>🔒 COPPA Compliant &amp; Secure</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. MULTILINGUAL SUPPORT (MAYA VOICE SHOWCASE) */}
      <section id="maya-voice" className="py-24 bg-slate-950 text-white px-6 scroll-mt-16 relative overflow-hidden">

        {/* Background gradient shine */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">

          {/* Avatar waveform display */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-80 h-80 rounded-[40px] bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between items-center shadow-2xl relative">
              <div className="live-glow-ring" />

              {/* Top info badge */}
              <div className="text-[9px] bg-primary px-3 py-1 rounded-full uppercase tracking-wider font-extrabold text-white z-10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
                Live Translation Mode
              </div>

              {/* Central avatar pulsing ring */}
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center z-10 shadow-lg border border-white/15 relative">
                <span className="material-symbols-outlined text-white text-[48px] animate-pulse">keyboard_voice</span>
              </div>

              {/* Dynamic waveform visual bars */}
              <div className="wave-container z-10">
                <span className="wave-bar wave-bar-1" />
                <span className="wave-bar wave-bar-2" />
                <span className="wave-bar wave-bar-3" />
                <span className="wave-bar wave-bar-4" />
                <span className="wave-bar wave-bar-5" />
                <span className="wave-bar wave-bar-6" />
                <span className="wave-bar wave-bar-7" />
              </div>
            </div>
          </div>

          {/* Core content text */}
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Indic Multilingual Engine</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight">
              Learn in Your Native Mother Tongue
            </h2>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              We believe syntax and translation issues should never block education. ClassOrbit leverages deep local fonts and neural translation APIs to support regional scripts automatically.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
                <span className="font-display text-primary font-extrabold text-lg">हि</span>
                <div>
                  <div className="text-xs font-bold">Hindi Mode</div>
                  <div className="text-[10px] text-slate-400">हिन्दी अनुवाद</div>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
                <span className="font-display text-primary font-extrabold text-lg">বা</span>
                <div>
                  <div className="text-xs font-bold">Bengali Mode</div>
                  <div className="text-[10px] text-slate-400">বাংলা ভাষা</div>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
                <span className="font-display text-primary font-extrabold text-lg">த</span>
                <div>
                  <div className="text-xs font-bold">Tamil Mode</div>
                  <div className="text-[10px] text-slate-400">தமிழ் கற்றல்</div>
                </div>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-3">
                <span className="font-display text-primary font-extrabold text-lg">తె</span>
                <div>
                  <div className="text-xs font-bold">Telugu Mode</div>
                  <div className="text-[10px] text-slate-400">తెలుగు బోధన</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* MEET YOUR TUTOR PERSONAS (INTERACTIVE WAVEFORM SIMULATOR) */}
      <section id="tutor-personas" className="py-24 bg-slate-950 text-white px-6 scroll-mt-16 relative overflow-hidden border-t border-slate-900">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-12 relative z-10">

          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">AI Customization</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight text-white">
              Meet Your Tutor Personas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Every student learns differently. Choose the persona that matches your child&apos;s style. Tap a persona below to preview Maya&apos;s voice speech-bubble and visual soundwaves:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">

            {/* Left Box: Persona buttons */}
            <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
              {(["socratic", "explainer", "friendly"] as const).map((personaKey) => {
                const persona = PERSONA_DATA[personaKey];
                const isActive = activePersona === personaKey;
                return (
                  <button
                    key={personaKey}
                    onClick={() => setActivePersona(personaKey)}
                    className={`w-full text-left p-4 rounded-2.5xl border transition-all cursor-pointer flex gap-4 ${isActive
                        ? "bg-white/10 border-white/20 shadow-lg -translate-y-0.5"
                        : "bg-transparent border-transparent hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white ${persona.avatarBg}`}>
                      <span className="material-symbols-outlined text-[20px]">{persona.avatarIcon}</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{persona.title}</div>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1 truncate max-w-[220px]">
                        {persona.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Box: Visual Speech Bubble and sound wave visualizer */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between relative overflow-hidden shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white ${PERSONA_DATA[activePersona].avatarBg}`}>
                    <span className="material-symbols-outlined text-[16px]">{PERSONA_DATA[activePersona].avatarIcon}</span>
                  </div>
                  <span className="text-xs font-bold text-white">{PERSONA_DATA[activePersona].title} Speech Preview</span>
                </div>
                <span className="text-[8px] bg-white/10 text-slate-300 font-extrabold px-2 py-0.5 rounded-full">ACTIVE TONE</span>
              </div>

              {/* Body: speech bubble */}
              <div className="flex-1 flex flex-col justify-center my-3 relative">
                <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl rounded-tl-none border border-slate-800 text-xs font-semibold leading-relaxed whitespace-pre-line">
                  {PERSONA_DATA[activePersona].dialogue}
                </div>
              </div>

              {/* Footer soundwave wrapper */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Voice Wave Sync</span>

                {/* Dynamically styling waveforms */}
                <div className="flex items-center gap-1 h-8 px-1 shrink-0">
                  {PERSONA_DATA[activePersona].waveHeights.map((h, hIdx) => (
                    <span
                      key={hIdx}
                      className={`w-0.5 ${h} ${PERSONA_DATA[activePersona].waveColor} rounded-full ${PERSONA_DATA[activePersona].waveSpeed}`}
                      style={{
                        animation: "audioWave 1.2s ease-in-out infinite",
                        animationDelay: `${hIdx * 0.15}s`
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section id="faq" className="py-24 bg-white px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Header */}
          <div className="text-center space-y-3">
            <span className="text-xs uppercase tracking-wider font-black text-primary">Support &amp; FAQ</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium leading-relaxed">
              Have questions about how ClassOrbit Socratic features operate? We have answers.
            </p>
          </div>

          {/* Accordion Container */}
          <div className="space-y-3.5 select-none">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = faqOpen === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-3xl transition-all duration-300 overflow-hidden ${isOpen ? "bg-primary/5 border-primary/20 shadow-xs" : "bg-transparent border-slate-100 hover:border-slate-300"
                    }`}
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer transition-all duration-200"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 pr-4">{item.question}</span>
                    <span className={`material-symbols-outlined shrink-0 text-[20px] text-primary transition-transform duration-300 ${isOpen ? "rotate-45" : ""
                      }`}>
                      add
                    </span>
                  </button>

                  {/* Expandable Panel */}
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[300px] border-t border-slate-100" : "max-h-0 pointer-events-none"
                    }`}>
                    <div className="px-6 py-5 text-xs text-on-surface-variant leading-relaxed font-medium">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. BOTTOM DYNAMIC CALL-TO-ACTION (CTA) BANNER */}
      <section className="py-16 bg-background px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-tr from-primary to-secondary text-white rounded-[36px] p-8 sm:p-12 lg:p-16 text-center shadow-xl relative overflow-hidden flex flex-col items-center justify-center gap-6">
          {/* Ambient overlay spots */}
          <div className="absolute inset-0 bg-black/10 z-1" />
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight leading-tight">
              Unlock Your Child&apos;s Full Academic Potential
            </h2>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              Join thousands of students building deep cognitive intuition and learning Socratic mastery step-by-step with Maya.
            </p>
          </div>

          <div className="relative z-10 pt-2">
            <button
              onClick={handleCTA}
              className="h-14 px-10 bg-white hover:bg-slate-50 text-primary hover:text-secondary text-sm font-black rounded-full transition-all duration-300 shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              Get Started Now
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-900 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
            <span className="font-display font-bold text-base text-white tracking-tight">ClassOrbit</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase font-bold tracking-wider">
            <a href="#features" onClick={(e) => handleScrollTo(e, "features")} className="hover:text-white transition-colors">Features</a>
            <a href="#socratic-method" onClick={(e) => handleScrollTo(e, "socratic-method")} className="hover:text-white transition-colors">Socratic Approach</a>
            <a href="#maya-voice" onClick={(e) => handleScrollTo(e, "maya-voice")} className="hover:text-white transition-colors">Maya AI</a>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>

          <div className="text-[10px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} ClassOrbit. All rights reserved. Luminous Intelligence.
          </div>
        </div>
      </footer>

    </div>
  );
}
