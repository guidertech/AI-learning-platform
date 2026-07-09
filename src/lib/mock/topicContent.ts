export interface TopicStep {
  title: string;
  durationText: string;
  imageSrc: string;
  descriptionText: string;
}

export interface TopicContent {
  title: string;
  tutorWelcomeMessage: string;
  learnStep: TopicStep;
  exampleStep: TopicStep;
  thinkStep: {
    promptText: string;
    options: string[];
    correctAnswerText: string;
  };
  quickReplies: string[];
}

export const topicContents: Record<string, TopicContent> = {
  "fractions-intro": {
    title: "Introduction to Fractions",
    tutorWelcomeMessage: "Hi! I'm Maya. Today we are learning about what fractions are. Feel free to ask me any questions!",
    learnStep: {
      title: "Understanding the Parts",
      durationText: "~30 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Think of a fraction as a 'part of a whole.' When you divide one thing into several equal pieces, each piece represents a fraction."
    },
    exampleStep: {
      title: "The Pizza Party",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "If a pizza is cut into 8 equal slices, and you eat 1 slice, you've consumed 1/8. The 1 is your part, and the 8 is the total whole!"
    },
    thinkStep: {
      promptText: "If you share a pizza with 3 friends (4 people total), how many slices does everyone get if it's cut into 8?",
      options: ["1 slice (1/8)", "2 slices (2/8 or 1/4)", "3 slices (3/8)"],
      correctAnswerText: "2 slices (2/8 or 1/4)"
    },
    quickReplies: [
      "What is a numerator?",
      "Give me a pizza example",
      "How do I write 1 out of 4?"
    ]
  },
  "equivalent-fractions": {
    title: "Equivalent Fractions",
    tutorWelcomeMessage: "Hi! Let's explore how different fractions can actually represent the exact same amount. Ask me anything!",
    learnStep: {
      title: "Equal Value, Different Numbers",
      durationText: "~45 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Equivalent fractions are fractions that look different but have the same value. For example, 1/2 is the same as 2/4 or 4/8."
    },
    exampleStep: {
      title: "Chocolate Bar Sharing",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "If you eat half of a chocolate bar, and your friend eats two quarters of an identical bar, you both ate the exact same amount of chocolate!"
    },
    thinkStep: {
      promptText: "Which of these fractions is equivalent to 3/4?",
      options: ["6/8", "5/6", "9/10"],
      correctAnswerText: "6/8"
    },
    quickReplies: [
      "Explain 1/2 vs 2/4",
      "How to find equivalent fractions",
      "Is 3/4 same as 6/8?"
    ]
  },
  "mixed-numbers": {
    title: "Mixed Numbers",
    tutorWelcomeMessage: "Hi there! Today we are working on Mixed Numbers. Ask me how to convert between mixed numbers and improper fractions!",
    learnStep: {
      title: "Wholes and Parts Together",
      durationText: "~45 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "A mixed number combines a whole number and a fraction. For example, 1 1/2 represents one full object and a half of another."
    },
    exampleStep: {
      title: "Baking Cookies",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "If a recipe calls for 2 1/4 cups of flour, you need two full cups plus one quarter of another cup."
    },
    thinkStep: {
      promptText: "Convert 9/4 into a mixed number. What is the result?",
      options: ["2 1/4", "2 1/2", "1 3/4"],
      correctAnswerText: "2 1/4"
    },
    quickReplies: [
      "What is a mixed number?",
      "How to convert to improper fraction",
      "Explain 2 1/4 cups flour"
    ]
  },
  "place-values": {
    title: "Place Values up to Millions",
    tutorWelcomeMessage: "Hello! Let's study place values and large numbers up to the Millions. Let me know if you want to practice reading big numbers!",
    learnStep: {
      title: "The Place Value Columns",
      durationText: "~40 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "As numbers get larger, each position to the left represents a value 10 times larger than the previous one: Ones, Tens, Hundreds, Thousands, Millions."
    },
    exampleStep: {
      title: "Population Counts",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "A city with 4,250,000 residents has 4 Millions, 2 Hundred Thousands, and 5 Ten Thousands."
    },
    thinkStep: {
      promptText: "In the number 7,843,210, which digit is in the Millions place?",
      options: ["7", "8", "4"],
      correctAnswerText: "7"
    },
    quickReplies: [
      "What is the millions place?",
      "Explain place value columns",
      "Write 4 million in digits"
    ]
  },
  "comparing-decimals": {
    title: "Comparing Decimals",
    tutorWelcomeMessage: "Hi! Comparing decimals is all about checking place values column by column. Ask me any question!",
    learnStep: {
      title: "Decimal Alignment",
      durationText: "~45 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "To compare decimals, align the decimal points and compare the digits from left to right: tenths, hundredths, thousandths."
    },
    exampleStep: {
      title: "Race Finish Times",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "A runner who finishes in 10.25 seconds is faster than one finishing in 10.3 seconds because 2 tenths is smaller than 3 tenths."
    },
    thinkStep: {
      promptText: "Which decimal number is the largest?",
      options: ["0.45", "0.409", "0.452"],
      correctAnswerText: "0.452"
    },
    quickReplies: [
      "How to compare decimals",
      "Is 0.45 bigger than 0.409?",
      "Explain race times decimal"
    ]
  },
  "column-addition": {
    title: "Multi-digit Column Addition",
    tutorWelcomeMessage: "Hello! Column addition is super easy once you align the columns and carry over when needed. Let's do some math!",
    learnStep: {
      title: "Align and Carry Over",
      durationText: "~50 sec",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Write the numbers column-by-column aligning the ones. Add from right to left. If a column sum is 10 or more, carry the tens to the next column."
    },
    exampleStep: {
      title: "Store Sales Totaling",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "Adding 1,489 and 2,572 gives 4,061 by carrying 1 over several columns starting from the ones column."
    },
    thinkStep: {
      promptText: "What is 358 + 497?",
      options: ["855", "845", "755"],
      correctAnswerText: "855"
    },
    quickReplies: [
      "How to carry over numbers",
      "Solve 358 + 497",
      "Why align ones column?"
    ]
  },
  "remainder-division": {
    title: "Division with Remainders",
    tutorWelcomeMessage: "Hi there! Ready to learn about division with remainders? Let me know if you want me to write down a division problem for us.",
    learnStep: {
      title: "Leftover Amounts",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "When a number cannot be split exactly into equal parts, the leftover amount is called the remainder. It is always smaller than the divisor."
    },
    exampleStep: {
      title: "Sharing Balloons",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "If you have 17 balloons and share them equally among 4 friends, each friend gets 4 balloons, and you have 1 balloon left over (17 ÷ 4 = 4 R 1)."
    },
    thinkStep: {
      promptText: "What is 26 ÷ 5?",
      options: ["5 remainder 1", "5 remainder 2", "4 remainder 6"],
      correctAnswerText: "5 remainder 1"
    },
    quickReplies: [
      "What is a remainder?",
      "Solve 26 divided by 5",
      "Explain sharing balloons"
    ]
  },
  "equation": {
    title: "The Photosynthesis Equation",
    tutorWelcomeMessage: "Hello! Today we are studying how plants convert solar energy, water, and carbon dioxide into food. Ask me about chloroplasts!",
    learnStep: {
      title: "The Chemical Formula",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Photosynthesis is the process by which green plants use sunlight to synthesize glucose and oxygen from carbon dioxide and water: 6CO2 + 6H2O + light -> C6H12O6 + 6O2."
    },
    exampleStep: {
      title: "Oxygen Release",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "Plants take in carbon dioxide through leaves and water through roots, and use solar energy to create sugar for growth, releasing oxygen for us to breathe!"
    },
    thinkStep: {
      promptText: "What are the primary products created by photosynthesis?",
      options: ["Carbon dioxide and water", "Glucose and oxygen", "Nitrogen and helium"],
      correctAnswerText: "Glucose and oxygen"
    },
    quickReplies: [
      "What is the photosynthesis formula?",
      "Why plants need CO2?",
      "What is glucose used for?"
    ]
  },
  "background-and-rowlatt-act": {
    title: "Background and Rowlatt Act",
    tutorWelcomeMessage: "Welcome to history class! Let's discuss the Rowlatt Act of 1919 and why it caused huge protests in India. Ask me any historical context!",
    learnStep: {
      title: "Protests and Arrests",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Passed by the Imperial Legislative Council in 1919, the Rowlatt Act authorized the British government to imprison any person suspected of terrorism for up to two years without trial."
    },
    exampleStep: {
      title: "Nationwide Strikes",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "Mahatma Gandhi organized the Rowlatt Satyagraha, leading to nationwide strikes (hartals) and mass assemblies protesting against this restrictive act."
    },
    thinkStep: {
      promptText: "In which year was the Rowlatt Act passed by the British council?",
      options: ["1915", "1919", "1923"],
      correctAnswerText: "1919"
    },
    quickReplies: [
      "What was the Rowlatt Act?",
      "Why did Gandhi protest?",
      "Explain nationwide strikes"
    ]
  },
  "jallianwala-bagh-massacre-event": {
    title: "The Jallianwala Bagh Massacre",
    tutorWelcomeMessage: "Hello. We are studying the tragic event of the Jallianwala Bagh Massacre on April 13, 1919. Please feel free to ask questions about this history.",
    learnStep: {
      title: "Gathering at Amritsar",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "On Baisakhi, thousands of peaceful protestors and pilgrims gathered in the walled Jallianwala Bagh in Amritsar. British troops blocked the only narrow exit."
    },
    exampleStep: {
      title: "Firing Without Warning",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "Without ordering the crowd to disperse, troops opened fire on the trapped crowd for 10 minutes until their ammunition was exhausted, causing hundreds of deaths."
    },
    thinkStep: {
      promptText: "On which major Punjabi festival did the Jallianwala Bagh gathering take place?",
      options: ["Baisakhi", "Diwali", "Lohri"],
      correctAnswerText: "Baisakhi"
    },
    quickReplies: [
      "What happened on Baisakhi 1919?",
      "Why was Jallianwala Bagh walled?",
      "How did the crowd react?"
    ]
  },
  "general-dyer-actions": {
    title: "General Dyer's Actions",
    tutorWelcomeMessage: "Welcome. Let's analyze General Dyer's actions and his intentions at Jallianwala Bagh. I am here to help you study this topic.",
    learnStep: {
      title: "The Martial Law order",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "Brigadier-General Reginald Dyer had banned public meetings under martial law. He stated his firing was intended to 'produce a moral effect' and punish protestors."
    },
    exampleStep: {
      title: "The Hunter Committee",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "When questioned later by the Hunter Commission, Dyer admitted that he would have used machine guns if he could have driven his armored cars into the Bagh."
    },
    thinkStep: {
      promptText: "What committee was formed by the British government to investigate General Dyer's actions?",
      options: ["Simon Commission", "Hunter Commission", "Rowlatt Committee"],
      correctAnswerText: "Hunter Commission"
    },
    quickReplies: [
      "Who was General Dyer?",
      "What was the Hunter Commission?",
      "Why did Dyer fire on the crowd?"
    ]
  },
  "impact-on-freedom-movement": {
    title: "Impact on the Freedom Movement",
    tutorWelcomeMessage: "Hello! Let's discuss how Jallianwala Bagh changed the course of India's struggle for independence. Ask me about the Non-Cooperation Movement!",
    learnStep: {
      title: "Turning Point in History",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "The massacre destroyed all trust Indians had in the British legal system, turning moderate politicians like Gandhi into radical freedom fighters."
    },
    exampleStep: {
      title: "Non-Cooperation Launch",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "In response to the massacre, Gandhi launched the Non-Cooperation Movement in 1920, urging Indians to boycott British goods, schools, and offices."
    },
    thinkStep: {
      promptText: "Which major mass protest movement was launched by Gandhi in 1920 shortly after the massacre?",
      options: ["Non-Cooperation Movement", "Quit India Movement", "Civil Disobedience Movement"],
      correctAnswerText: "Non-Cooperation Movement"
    },
    quickReplies: [
      "How did massacre change Gandhi?",
      "What was Non-Cooperation Movement?",
      "Why boycott British goods?"
    ]
  },
  "national-and-international-reactions": {
    title: "National and International Reactions",
    tutorWelcomeMessage: "Hi. Today we study how leaders worldwide reacted to the Amritsar Massacre. Ask me about Rabindranath Tagore renouncing his Knighthood!",
    learnStep: {
      title: "Renouncing Honors",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDf_IKR0yBGVX2eJ1rWVxjCQoz4YAdX1dJDCDCPv2lhlDdOlpQrpUqUm02hR_fhsI5rSuuZ2APm2G9DuaXDUdAM4OCf4dOIN6Tqy9MlbRXQW4hvn-trVr-T6dHirbxqNJTvcvxDklhcHUOP8wJE_qJmhET3suQ-J9Pep4g_8-I0NMnw1mGyixBi1e_e40D5jXEJt1otZNb7x-KO4LpwE3X27YfHYClYLcJObpzux4UtcrRA1Di52lUUSKu8XaiCTS0hWryLjQwHyQ",
      descriptionText: "In protest of the horrific actions at Amritsar, Nobel laureate Rabindranath Tagore renounced his British knighthood."
    },
    exampleStep: {
      title: "House of Commons Debate",
      durationText: "~1 min",
      imageSrc: "https://lh3.googleusercontent.com/aida/AP1WRLsjwJ-9ibIX6zhvQAlRqvsLnrxUdURPxkrgpFL4qpDmAUrYiOSoZjMX_ipBnum3RlucxR89ZdFbeOPBZHnBcgcuQannTPDGeYgH2itqehbkS1ObWqxLb5JHulkAVQw-K-uhHrxU5Qnbfl2NkJYrS-0o2BPT3Jcezg3LjZNZcVqB2Ja-TsiTmAmbXGwl3fDanKnxoaGOQKubJ6_EpdDI60eAyH8rVLdxQPZhbTVYN7OIAvIXUXdSXPW58oY",
      descriptionText: "In London, Winston Churchill condemned Dyer's actions as 'monstrous.' Dyer was officially censured and relieved of his command by the military."
    },
    thinkStep: {
      promptText: "Which Indian Nobel laureate renounced his British Knighthood in protest?",
      options: ["Rabindranath Tagore", "C.V. Raman", "Mahatma Gandhi"],
      correctAnswerText: "Rabindranath Tagore"
    },
    quickReplies: [
      "Why did Tagore renounce Knighthood?",
      "What was Churchill's reaction?",
      "Was Dyer punished?"
    ]
  }
};
