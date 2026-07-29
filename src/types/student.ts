export interface StudentProfile {
  id: string;
  fullName: string;
  currentClass: string;
  school?: string;
  age?: number;
  dailyGoalMins: number;
  studentMins: number;
  percentComplete: number;
}
