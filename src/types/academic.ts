export interface Concept {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  durationSeconds: number;
  description: string;
  hasRecoveryLoop: boolean;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  concepts?: Concept[];
}

export interface Chapter {
  id: string;
  title: string;
  slug: string;
  orderIndex: number;
  description: string;
  topics: Topic[];
  hasPrerequisite?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  chapters: Chapter[];
  color?: string;
  icon?: string;
}
