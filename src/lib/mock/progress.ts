import { DailyStudyStats, Milestone, SubjectProficiency } from "@/types/progress";

export const mockDailyStats: DailyStudyStats[] = [
  { day: "Mon", heightPercent: "40%", hours: 1.5 },
  { day: "Tue", heightPercent: "65%", hours: 2.2 },
  { day: "Wed", heightPercent: "30%", hours: 1.0 },
  { day: "Thu", heightPercent: "90%", hours: 4.2, active: true },
  { day: "Fri", heightPercent: "55%", hours: 2.0 },
  { day: "Sat", heightPercent: "75%", hours: 3.5 },
  { day: "Sun", heightPercent: "45%", hours: 1.8 }
];

export const mockMilestones: Milestone[] = [
  {
    id: "mile-1",
    title: "5-Day Streak",
    icon: "local_fire_department",
    colorClass: "text-orange-700",
    bgClass: "bg-orange-50",
    borderClass: "border-orange-200"
  },
  {
    id: "mile-2",
    title: "Deep Learner",
    icon: "book",
    colorClass: "text-blue-700",
    bgClass: "bg-blue-50",
    borderClass: "border-blue-200"
  },
  {
    id: "mile-3",
    title: "Concept Crusher",
    icon: "target",
    colorClass: "text-purple-700",
    bgClass: "bg-purple-50",
    borderClass: "border-purple-200"
  }
];

export const mockSubjectProficiencies: SubjectProficiency[] = [
  { name: "Mathematics", score: 85, colorClass: "bg-primary" },
  { name: "Science", score: 62, colorClass: "bg-[#0ea5e9]" },
  { name: "Social Science", score: 45, colorClass: "bg-[#f59e0b]" },
  { name: "English", score: 78, colorClass: "bg-[#10b981]" }
];
