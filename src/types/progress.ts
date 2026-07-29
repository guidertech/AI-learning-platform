export interface DailyStudyStats {
  day: string; // "Mon", "Tue", etc.
  heightPercent: string; // e.g. "40%"
  hours: number;
  active?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  icon: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export interface SubjectProficiency {
  name: string;
  score: number;
  colorClass: string;
}
