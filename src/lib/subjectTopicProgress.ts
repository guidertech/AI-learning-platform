type Id = string | number;

export type SubjectProgressInput = {
  subject_id: Id;
  name: string;
  icon?: string;
  [key: string]: unknown;
};

export type ChapterProgressInput = {
  chapter_id: Id;
  subject_id: Id;
};

export type TopicProgressInput = {
  topic_id: Id;
  chapter_id: Id;
};

export type CompletedTopicInput = {
  topic_id: Id;
  completed?: boolean;
  is_completed?: boolean;
};

export type SubjectTopicProgress = SubjectProgressInput & {
  totalTopics: number;
  completedTopics: number;
  completionPct: number;
};

const normalizeId = (value: Id) => String(value);

export function calculateSubjectTopicProgress(
  subjects: SubjectProgressInput[],
  chapters: ChapterProgressInput[],
  topics: TopicProgressInput[],
  progressRows: CompletedTopicInput[],
): SubjectTopicProgress[] {
  const completedTopicIds = new Set(
    progressRows
      .filter((row) => row.completed === true || row.is_completed === true)
      .map((row) => normalizeId(row.topic_id)),
  );

  return subjects.map((subject) => {
    const subjectId = normalizeId(subject.subject_id);
    const chapterIds = new Set(
      chapters
        .filter((chapter) => normalizeId(chapter.subject_id) === subjectId)
        .map((chapter) => normalizeId(chapter.chapter_id)),
    );
    const subjectTopics = topics.filter((topic) =>
      chapterIds.has(normalizeId(topic.chapter_id)),
    );
    const completedTopics = subjectTopics.filter((topic) =>
      completedTopicIds.has(normalizeId(topic.topic_id)),
    ).length;
    const totalTopics = subjectTopics.length;

    return {
      ...subject,
      totalTopics,
      completedTopics,
      completionPct:
        totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
    };
  });
}
