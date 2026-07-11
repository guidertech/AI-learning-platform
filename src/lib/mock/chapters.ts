import { Chapter } from "@/types/academic";

export const mockChapters: Record<string, Chapter[]> = {
  "sub-math": [
    {
      id: "ch-1",
      title: "Chapter 1: Number Systems",
      slug: "number-systems",
      orderIndex: 1,
      description: "Learn about large numbers, place values, and decimals.",
      hasPrerequisite: true,
      topics: [
        { id: "top-1-1", title: "Place Values up to Millions", slug: "place-values", orderIndex: 1 },
        { id: "top-1-2", title: "Comparing Decimals", slug: "comparing-decimals", orderIndex: 2 }
      ]
    },
    {
      id: "ch-2",
      title: "Chapter 2: Additions & Subtractions",
      slug: "addition-subtraction",
      orderIndex: 2,
      description: "Review multi-digit column arithmetic.",
      hasPrerequisite: true,
      topics: [
        { id: "top-2-1", title: "Multi-digit Column Addition", slug: "column-addition", orderIndex: 1 }
      ]
    },
    {
      id: "ch-3",
      title: "Chapter 3: Multiplication & Division",
      slug: "multiplication-division",
      orderIndex: 3,
      description: "Understand remainder division and factor trees.",
      hasPrerequisite: true,
      topics: [
        { id: "top-3-1", title: "Division with Remainders", slug: "remainder-division", orderIndex: 1 }
      ]
    },
    {
      id: "ch-4",
      title: "Chapter 4: Fractions & Decimals",
      slug: "fractions-decimals",
      orderIndex: 4,
      description: "Introduction to equivalent fractions, mixed numbers, and visual models.",
      hasPrerequisite: true,
      topics: [
        { id: "top-4-1", title: "Introduction to Fractions", slug: "fractions-intro", orderIndex: 1 },
        { id: "top-4-2", title: "Equivalent Fractions", slug: "equivalent-fractions", orderIndex: 2 },
        { id: "top-4-3", title: "Mixed Numbers", slug: "mixed-numbers", orderIndex: 3 }
      ]
    },
    {
      id: "ch-5",
      title: "Chapter 5: Data Handling",
      slug: "data-handling",
      orderIndex: 5,
      description: "Learn about bar graphs, tally marks, and mean averages.",
      hasPrerequisite: true,
      topics: [
        { id: "top-5-1", title: "Reading Bar Graphs", slug: "bar-graphs", orderIndex: 1 },
        { id: "top-5-2", title: "Averages & Mean", slug: "averages-mean", orderIndex: 2 }
      ]
    }
  ],

  "sub-sci": [
    {
      id: "ch-sci-1",
      title: "Chapter 1: Plants & Photosynthesis",
      slug: "photosynthesis",
      orderIndex: 1,
      description: "Explore chlorophyll, carbon capture, and plant energy.",
      hasPrerequisite: true,
      topics: [
        { id: "top-sci-1-1", title: "The Photosynthesis Equation", slug: "photosynthesis-equation", orderIndex: 1 }
      ]
    },
    {
      id: "ch-sci-2",
      title: "Chapter 2: Forces & Motion",
      slug: "forces-motion",
      orderIndex: 2,
      description: "Understand gravity, friction, and Newton's laws.",
      hasPrerequisite: true,
      topics: [
        { id: "top-sci-2-1", title: "Gravity & Friction", slug: "gravity-friction", orderIndex: 1 }
      ]
    },
    {
      id: "ch-sci-3",
      title: "Chapter 3: Heat & Temperature",
      slug: "heat-temp",
      orderIndex: 3,
      description: "Learn about conduction, convection, and thermometer scales.",
      hasPrerequisite: true,
      topics: [
        { id: "top-sci-3-1", title: "Conduction & Heat Flow", slug: "heat-conduction", orderIndex: 1 }
      ]
    },
    {
      id: "ch-sci-4",
      title: "Chapter 4: The Solar System",
      slug: "solar-system",
      orderIndex: 4,
      description: "Explore the planets, orbit cycles, and asteroid belts.",
      hasPrerequisite: true,
      topics: [
        { id: "top-sci-4-1", title: "Planets & Orbit Cycles", slug: "planets-orbits", orderIndex: 1 }
      ]
    },
    {
      id: "ch-sci-5",
      title: "Chapter 5: Human Body Systems",
      slug: "human-body",
      orderIndex: 5,
      description: "Learn about the digestive, circulatory, and respiratory systems.",
      hasPrerequisite: true,
      topics: [
        { id: "top-sci-5-1", title: "The Digestive System", slug: "digestive-system", orderIndex: 1 }
      ]
    }
  ],

  "sub-eng": [
    {
      id: "ch-eng-1",
      title: "Chapter 1: Parts of Speech",
      slug: "parts-of-speech",
      orderIndex: 1,
      description: "Master nouns, pronouns, verbs, adjectives, and adverbs.",
      hasPrerequisite: false,
      topics: [
        { id: "top-eng-1-1", title: "Nouns & Pronouns", slug: "nouns-pronouns", orderIndex: 1 },
        { id: "top-eng-1-2", title: "Adjectives & Adverbs", slug: "adjectives-adverbs", orderIndex: 2 }
      ]
    },
    {
      id: "ch-eng-2",
      title: "Chapter 2: Verbs & Tenses",
      slug: "verbs-tenses",
      orderIndex: 2,
      description: "Understand past, present, and future verb conjugations.",
      hasPrerequisite: false,
      topics: [
        { id: "top-eng-2-1", title: "Present & Past Tenses", slug: "present-past-tenses", orderIndex: 1 }
      ]
    },
    {
      id: "ch-eng-3",
      title: "Chapter 3: Sentence Structure",
      slug: "sentence-structure",
      orderIndex: 3,
      description: "Learn about subjects, predicates, and run-on sentences.",
      hasPrerequisite: false,
      topics: [
        { id: "top-eng-3-1", title: "Subject & Predicate", slug: "subject-predicate", orderIndex: 1 }
      ]
    },
    {
      id: "ch-eng-4",
      title: "Chapter 4: Punctuation Rules",
      slug: "punctuation-rules",
      orderIndex: 4,
      description: "Learn commas, apostrophes, and quotation marks.",
      hasPrerequisite: false,
      topics: [
        { id: "top-eng-4-1", title: "Commas & Apostrophes", slug: "commas-apostrophes", orderIndex: 1 }
      ]
    },
    {
      id: "ch-eng-5",
      title: "Chapter 5: Synonyms & Antonyms",
      slug: "synonyms-antonyms",
      orderIndex: 5,
      description: "Expand vocabulary with word associations.",
      hasPrerequisite: false,
      topics: [
        { id: "top-eng-5-1", title: "Synonyms & Antonyms", slug: "synonyms-antonyms-words", orderIndex: 1 }
      ]
    }
  ],

  "sub-hist": [
    {
      id: "ch-hist-1",
      title: "Chapter 1: Jallianwala Bagh Massacre",
      slug: "jallianwala-bagh-massacre",
      orderIndex: 1,
      description: "Explore the causes, events, and impact of the Jallianwala Bagh Massacre on India's freedom struggle.",
      hasPrerequisite: false,
      topics: [
        { id: "top-hist-1-1", title: "Background and Rowlatt Act", slug: "background-and-rowlatt-act", orderIndex: 1 },
        { id: "top-hist-1-2", title: "General Dyer's Actions", slug: "general-dyer-actions", orderIndex: 2 }
      ]
    },
    {
      id: "ch-hist-2",
      title: "Chapter 2: The Revolt of 1857",
      slug: "revolt-1857",
      orderIndex: 2,
      description: "Understand the first war of Indian Independence.",
      hasPrerequisite: false,
      topics: [
        { id: "top-hist-2-1", title: "Causes of the Uprising", slug: "revolt-causes", orderIndex: 1 }
      ]
    },
    {
      id: "ch-hist-3",
      title: "Chapter 3: The Indian Constitution",
      slug: "indian-constitution",
      orderIndex: 3,
      description: "Learn how the supreme law of India was drafted.",
      hasPrerequisite: false,
      topics: [
        { id: "top-hist-3-1", title: "Preamble & Rights", slug: "preamble-rights", orderIndex: 1 }
      ]
    },
    {
      id: "ch-hist-4",
      title: "Chapter 4: The French Revolution",
      slug: "french-revolution",
      orderIndex: 4,
      description: "Explore Liberty, Equality, and Fraternity concepts.",
      hasPrerequisite: false,
      topics: [
        { id: "top-hist-4-1", title: "Storming the Bastille", slug: "french-revolution-bastille", orderIndex: 1 }
      ]
    },
    {
      id: "ch-hist-5",
      title: "Chapter 5: The Industrial Revolution",
      slug: "industrial-revolution",
      orderIndex: 5,
      description: "Understand steam engines, factories, and urban growth.",
      hasPrerequisite: false,
      topics: [
        { id: "top-hist-5-1", title: "Steam Engines & Factories", slug: "steam-engines-factories", orderIndex: 1 }
      ]
    }
  ]
};