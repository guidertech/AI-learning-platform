import { Subject } from "@/types/academic";

export const mockSubjects: Subject[] = [
  {
    id: "sub-math",
    name: "Mathematics",
    slug: "mathematics",
    color: "bg-primary text-white",
    icon: "calculate",
    chapters: []
  },
  {
    id: "sub-sci",
    name: "Science",
    slug: "science",
    color: "bg-[#0ea5e9] text-white",
    icon: "biotech",
    chapters: []
  },
  {
    id: "sub-eng",
    name: "English",
    slug: "english",
    color: "bg-[#10b981] text-white",
    icon: "menu_book",
    chapters: []
  },
  {
    id: "sub-hist",
    name: "Social Science",
    slug: "social-science",
    color: "bg-[#f59e0b] text-white",
    icon: "public",
    chapters: []
  }
];
