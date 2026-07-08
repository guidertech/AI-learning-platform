import { Chapter } from "@/types/academic";

export const mockChapters: Record<string, Chapter[]> = {
  "sub-math": [
    {
      id: "ch-1",
      title: "Chapter 1: Number Systems",
      slug: "number-systems",
      orderIndex: 1,
      description: "Learn about large numbers, place values, and decimals.",
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
      topics: [
        { 
          id: "top-4-1", 
          title: "Introduction to Fractions", 
          slug: "fractions-intro", 
          orderIndex: 1
        },
        { 
          id: "top-4-2", 
          title: "Equivalent Fractions", 
          slug: "equivalent-fractions", 
          orderIndex: 2
        },
        { 
          id: "top-4-3", 
          title: "Mixed Numbers", 
          slug: "mixed-numbers", 
          orderIndex: 3,
          concepts: [
            {
              id: "con-1",
              title: "Parts of a Whole",
              slug: "parts-of-a-whole",
              orderIndex: 1,
              durationSeconds: 30,
              description: "Conceptualizing fractions as equal portions of a unit object.",
              hasRecoveryLoop: true
            },
            {
              id: "con-2",
              title: "Convert Mixed Numbers",
              slug: "convert-mixed-numbers",
              orderIndex: 2,
              durationSeconds: 60,
              description: "Converting improper fractions to mixed numbers and vice versa.",
              hasRecoveryLoop: false
            }
          ]
        }
      ]
    }
  ],
  "sub-sci": [
    {
      id: "ch-sci-1",
      title: "Chapter 1: Plants & Photosynthesis",
      slug: "photosynthesis",
      orderIndex: 1,
      description: "Explore chlorophyl, carbon capture, and plant energy.",
      topics: [
        { id: "top-sci-1-1", title: "The Photosynthesis Equation", slug: "equation", orderIndex: 1 }
      ]
    }
  ]
};
