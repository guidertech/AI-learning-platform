export type PrereqLesson = {
  topic: string;
  title: string;
  explanation: string;
  imageSrc: string;
  example: string;
};

export const prereqLessons: Record<string, PrereqLesson> = {
  // --- Number Systems ---
  "Place Values": {
    topic: "Place Values",
    title: "Understanding Place Values",
    explanation: "Place value is the value of each digit in a number. For example, in 5,432, the digit 4 is in the hundreds place, so its value is 400. In 47,852, the 7 is in the thousands place, so its value is 7,000.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "In the number 3,60,000, the digit 6 represents 6 ten-thousands, which is 60,000."
  },
  "Comparing Numbers": {
    topic: "Comparing Numbers",
    title: "How to Compare Large Numbers",
    explanation: "To compare numbers, we look at the digits from left to right. Start with the highest place value. If the digits at that place are the same, compare the digits in the next place to the right.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "9,876 is greater than 9,867 because in the tens place, 7 is greater than 6."
  },
  "Comparing Decimals": {
    topic: "Comparing Decimals",
    title: "Comparing Decimal Numbers",
    explanation: "When comparing decimals, compare the whole numbers first. If they are equal, compare the tenths place, then the hundredths place. Adding zeros to the end of a decimal does not change its value.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "0.5 is greater than 0.45 because 0.5 can be written as 0.50. Comparing the tenths place, 5 tenths is greater than 4 tenths."
  },
  "Rounding": {
    topic: "Rounding",
    title: "Rounding Rules",
    explanation: "To round a number, look at the digit to the right of the place you are rounding to. If the digit is 5 or more, round up (add 1 to the rounding digit). If the digit is less than 5, round down (keep the rounding digit the same). All digits to the right become zeros.",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    example: "3.7 rounded to the nearest whole number is 4 because 7 is 5 or more."
  },
  "Large Numbers": {
    topic: "Large Numbers",
    title: "Visualizing Large Numbers",
    explanation: "Large numbers are organized using commas to separate periods (like thousands, lakhs, or millions). This makes them easier to read. For example, 1 crore is equivalent to 100 lakhs.",
    imageSrc: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848c?w=800&auto=format&fit=crop&q=60",
    example: "1 Crore = 10,000,000 (which is 100 lakhs)."
  },

  // --- Additions & Subtractions ---
  "Basic Addition": {
    topic: "Basic Addition",
    title: "Multi-digit Addition",
    explanation: "When adding large numbers, write them vertically, aligning the place values (ones, tens, hundreds). Start adding from the ones column. If the sum in any column is 10 or more, carry over the tens digit to the next column to the left.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "345 + 278: Units (5+8=13, carry 1), Tens (4+7+1=12, carry 1), Hundreds (3+2+1=6). Result = 623."
  },
  "Basic Subtraction": {
    topic: "Basic Subtraction",
    title: "Subtraction with Regrouping (Borrowing)",
    explanation: "When subtracting vertically, if the top digit in a column is smaller than the bottom digit, you must borrow 1 from the next place value column to the left (regrouping).",
    imageSrc: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&auto=format&fit=crop&q=60",
    example: "500 - 237 = 263. You regroup from the hundreds column down to the tens and ones."
  },
  "Column Method": {
    topic: "Column Method",
    title: "The Vertical Column Method",
    explanation: "The column method is the most reliable way to perform multi-digit addition and subtraction. It visually aligns numbers by their decimal and place value columns.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "Always keep columns straight to avoid adding units to tens or hundreds."
  },
  "Word Problems": {
    topic: "Word Problems",
    title: "Solving Word Problems",
    explanation: "To solve word problems, identify the keywords that tell you which operation to perform. 'Total', 'sum', and 'together' usually mean addition. 'Difference', 'left', and 'spent' usually mean subtraction.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "Ravi had Rs.5,000 and spent Rs.1,375. 'Spent' means subtraction: 5000 - 1375 = Rs.3,625 remaining."
  },

  // --- Multiplication & Division ---
  "Multiplication Tables": {
    topic: "Multiplication Tables",
    title: "Mastering Multiplication Facts",
    explanation: "Multiplication is repeated addition. Mastering single-digit multiplication tables (1 to 12) is critical for solving multi-digit multiplication and division quickly.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "7 × 8 is equivalent to adding seven 8s together: 8 + 8 + 8 + 8 + 8 + 8 + 8 = 56."
  },
  "Division Basics": {
    topic: "Division Basics",
    title: "Understanding Division",
    explanation: "Division is the process of splitting a number into equal parts or groups. It is the inverse of multiplication.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "48 ÷ 6 means 'how many 6s are in 48?'. Since 6 × 8 = 48, the answer is 8."
  },
  "Division with Remainders": {
    topic: "Division with Remainders",
    title: "Quotients and Remainders",
    explanation: "When a number cannot be divided equally, the leftover amount is called the remainder. The whole number result is the quotient.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "47 ÷ 4: 4 goes into 47 eleven times (4 × 11 = 44) with 3 left over. Quotient = 11, Remainder = 3."
  },
  "Factor Trees": {
    topic: "Factor Trees",
    title: "Prime Factorization",
    explanation: "A factor tree is a diagram used to break down a number into its prime factors. Prime factors are numbers that can only be divided by 1 and themselves.",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    example: "For 24: 24 splits into 2 × 12. 12 splits into 2 × 6. 6 splits into 2 × 3. The prime factors are 2 and 3."
  },

  // --- Fractions & Decimals ---
  "Fraction Basics": {
    topic: "Fraction Basics",
    title: "Numerators and Denominators",
    explanation: "A fraction represents a part of a whole. The denominator (bottom number) shows how many equal parts the whole is divided into. The numerator (top number) shows how many parts we are considering.",
    imageSrc: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848c?w=800&auto=format&fit=crop&q=60",
    example: "In 3/8, the whole is split into 8 slices, and you have 3 slices."
  },
  "Equivalent Fractions": {
    topic: "Equivalent Fractions",
    title: "Equivalent Fractions",
    explanation: "Equivalent fractions are fractions that represent the same value, even though they look different. You can find them by multiplying or dividing the numerator and denominator by the same number.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "1/4 is equivalent to 2/8 because if you multiply the top and bottom of 1/4 by 2, you get 2/8."
  },
  "Comparing Fractions": {
    topic: "Comparing Fractions",
    title: "Which Fraction is Larger?",
    explanation: "To compare fractions with different denominators, convert them to equivalent fractions with a common denominator. Then, compare their numerators.",
    imageSrc: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&auto=format&fit=crop&q=60",
    example: "To compare 2/3 and 3/4, use 12 as the denominator. 2/3 = 8/12 and 3/4 = 9/12. Since 9 > 8, 3/4 is larger than 2/3."
  },
  "Adding Fractions": {
    topic: "Adding Fractions",
    title: "Addition and Subtraction of Fractions",
    explanation: "To add or subtract fractions, they must have the same denominator. Once they do, add or subtract the numerators and keep the denominator the same.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "1/2 + 1/4 = 2/4 + 1/4 = 3/4."
  },
  "Mixed Numbers": {
    topic: "Mixed Numbers",
    title: "Understanding Mixed Numbers",
    explanation: "A mixed number combines a whole number and a fraction. An improper fraction has a numerator that is larger than or equal to the denominator.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "2 3/4 is equivalent to the improper fraction 11/4. You calculate this by doing (2 × 4 + 3) / 4."
  },

  // --- Data Handling ---
  "Bar Graphs": {
    topic: "Bar Graphs",
    title: "Understanding Bar Graphs",
    explanation: "Bar graphs use rectangular bars to compare different groups or track changes over time. The length of each bar is proportional to the value it represents.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "A bar of height 15 represents a value of 15, which is three times larger than a bar of height 5."
  },
  "Averages & Mean": {
    topic: "Averages & Mean",
    title: "Calculating Averages and Mean",
    explanation: "The mean is the average of a set of numbers. It is calculated by adding up all the numbers in the set and then dividing by the total count of those numbers.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "The mean of 5, 10, and 15 is (5 + 10 + 15) / 3 = 30 / 3 = 10."
  },

  // --- Plants & Photosynthesis ---
  "Photosynthesis Basics": {
    topic: "Photosynthesis Basics",
    title: "How Plants Feed Themselves",
    explanation: "Photosynthesis is the process by which green plants make their own food. Plants use their leaves to absorb sunlight, carbon dioxide from the air, and water from the soil to create sugars.",
    imageSrc: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=60",
    example: "Green leaves act as natural solar panels to capture energy."
  },
  "Chlorophyll": {
    topic: "Chlorophyll",
    title: "The Green Pigment: Chlorophyll",
    explanation: "Chlorophyll is a green pigment found inside plant cells (specifically in chloroplasts). It is responsible for trapping sunlight energy for photosynthesis.",
    imageSrc: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=60",
    example: "Chlorophyll absorbs red and blue light but reflects green light, which is why plants look green."
  },
  "Photosynthesis Equation": {
    topic: "Photosynthesis Equation",
    title: "The Chemical Equation of Photosynthesis",
    explanation: "Plants take in Carbon Dioxide (CO2) and Water (H2O), and using light energy, convert them into Glucose (sugar) and Oxygen (O2). The oxygen is released into the air.",
    imageSrc: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60",
    example: "CO2 + Water + Light energy -> Glucose + Oxygen."
  },
  "Plant Respiration": {
    topic: "Plant Respiration",
    title: "How Plants Breathe",
    explanation: "Just like animals, plants perform cellular respiration to break down sugars for energy. While photosynthesis only happens during daytime (sunlight), respiration happens 24/7.",
    imageSrc: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60",
    example: "At night, since there is no light, plants consume oxygen and release carbon dioxide."
  },

  // --- Forces & Motion ---
  "Gravity": {
    topic: "Gravity",
    title: "The Pull of Gravity",
    explanation: "Gravity is a fundamental pull force that acts between any two masses. The Earth's gravity pulls all objects toward its center, which gives us weight.",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    example: "When you drop an apple, Earth's gravity pulls it down to the ground."
  },
  "Friction": {
    topic: "Friction",
    title: "Friction Resistance Force",
    explanation: "Friction is a force that opposes motion between two surfaces in contact. Rougher surfaces generate more friction, which slows down moving objects.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "Ice is smooth and has low friction (easy to slide). Sandpaper is rough and has high friction."
  },
  "Newton's Laws": {
    topic: "Newton's Laws",
    title: "Newton's Laws of Motion",
    explanation: "Newton's laws describe how forces affect motion. An object stays at rest or in motion unless a force acts on it. Force equals mass times acceleration (F=ma), and every action has an equal, opposite reaction.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "Pushing a heavy cart requires more force than a light one because F=ma."
  },

  // --- Heat & Temperature ---
  "Conduction": {
    topic: "Conduction",
    title: "Heat Transfer via Conduction",
    explanation: "Conduction is the transfer of thermal energy (heat) through direct physical contact between particles in a solid material. Metals are excellent conductors.",
    imageSrc: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60",
    example: "A metal spoon left in hot soup gets hot because heat conducts up the spoon."
  },
  "Convection": {
    topic: "Convection",
    title: "Convection in Fluids and Gases",
    explanation: "Convection is heat transfer through the movement of liquids or gases. Heated fluid expands, becomes less dense, and rises, while cooler fluid sinks, creating a circulation loop.",
    imageSrc: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=800&auto=format&fit=crop&q=60",
    example: "Boiling water circulate heat through convection currents."
  },
  "Radiation": {
    topic: "Radiation",
    title: "Thermal Radiation",
    explanation: "Radiation is heat transfer through electromagnetic waves. Unlike conduction and convection, radiation requires no matter (medium) to travel and can pass through a vacuum.",
    imageSrc: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&auto=format&fit=crop&q=60",
    example: "Heat from the Sun reaches Earth through empty space via radiation."
  },
  "Thermometers": {
    topic: "Thermometers",
    title: "Measuring Heat and Temperature",
    explanation: "Temperature measures the average kinetic energy of particles. Thermometers use substances (like mercury) that expand predictably when heated to read values on Celsius or Fahrenheit scales.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "Water freezes at 0°C and boils at 100°C on the Celsius scale."
  },

  // --- The Solar System ---
  "Planets": {
    topic: "Planets",
    title: "The Planets of Our Solar System",
    explanation: "Our solar system has 8 planets orbiting the Sun. Rocky inner planets include Mercury, Venus, Earth, and Mars. Gas giant outer planets include Jupiter, Saturn, Uranus, and Neptune.",
    imageSrc: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60",
    example: "Jupiter is the largest planet, and Venus is the hottest due to atmospheric greenhouse effects."
  },
  "Moon Phases": {
    topic: "Moon Phases",
    title: "Phases of the Moon",
    explanation: "The Moon orbits Earth and reflects Sunlight. As it moves, we see different amounts of its illuminated half, creating phases: New Moon, Crescent, Half Moon, Gibbous, and Full Moon.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "A Full Moon occurs when the entire Earth-facing side of the Moon is lit by the Sun."
  },
  "Sun & Stars": {
    topic: "Sun & Stars",
    title: "The Sun and Distant Stars",
    explanation: "The Sun is the average-sized star at the center of our solar system. Stars are giant spheres of glowing plasma powered by nuclear fusion, which combines hydrogen into helium.",
    imageSrc: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=60",
    example: "The Sun provides the heat and light energy required to support all life on Earth."
  },

  // --- Human Body Systems ---
  "Digestive System": {
    topic: "Digestive System",
    title: "The Digestive Pathway",
    explanation: "The digestive system breaks down food into nutrients. It starts in the mouth with chewing and saliva, moves down the esophagus, digests in the stomach with acids, and absorbs nutrients in the small intestine.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "Villi in the small intestine act like tiny sponges to absorb food nutrients into the bloodstream."
  },
  "Heart & Blood": {
    topic: "Heart & Blood",
    title: "Circulatory System and Heart",
    explanation: "The circulatory system pumps blood throughout the body. The heart has 4 chambers. Red blood cells carry oxygen, white blood cells fight infections, and plasma carries nutrients.",
    imageSrc: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=60",
    example: "The heart pumps oxygenated blood from the lungs out to the rest of the body."
  },
  "Bones & Muscles": {
    topic: "Bones & Muscles",
    title: "The Skeletal and Muscular Systems",
    explanation: "Bones provide structure, protect organs, and count 206 in adults. Ligaments connect bones to bones. Skeletal muscles connect to bones via tendons, enabling voluntary motion.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "Biceps and triceps work in opposite pairs to bend and straighten your arm."
  },

  // --- Parts of Speech (English) ---
  "Nouns": {
    topic: "Nouns",
    title: "Nouns: People, Places, and Things",
    explanation: "A noun is a naming word. Common nouns are general (e.g., city, dog), while proper nouns are specific and capitalized (e.g., London, Rover). Plural nouns show more than one item.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "In the sentence 'The cat chased the mouse', 'cat' and 'mouse' are nouns."
  },
  "Pronouns": {
    topic: "Pronouns",
    title: "Pronouns: Replacing Nouns",
    explanation: "Pronouns replace nouns to avoid repetition. Subject pronouns (I, you, he, she, it, we, they) do actions. Object pronouns (me, him, her, us, them) receive actions. Possessive pronouns show ownership (mine, his, hers).",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "Instead of saying 'Sarah is here. Sarah is reading', we say 'Sarah is here. She is reading.'"
  },
  "Adjectives": {
    topic: "Adjectives",
    title: "Adjectives: Describing Words",
    explanation: "Adjectives modify or describe nouns and pronouns, giving details about size, color, quantity, or appearance.",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    example: "In 'the big red balloon', 'big' and 'red' are adjectives describing the balloon."
  },
  "Verbs": {
    topic: "Verbs",
    title: "Verbs: Actions and States",
    explanation: "Verbs state what a subject is doing or being. Action verbs express physical or mental actions (run, think), while helping auxiliary verbs assist tense formulation (is, was, will).",
    imageSrc: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848c?w=800&auto=format&fit=crop&q=60",
    example: "In 'They are running', 'running' is the action, and 'are' is the helping verb."
  },

  // --- Verbs & Tenses ---
  "Present Tense": {
    topic: "Present Tense",
    title: "Present Tense Conjugations",
    explanation: "Present tense describes current habits, facts, or actions happening now. Simple present adds -s or -es for third-person singular (he, she, it). Present continuous describes ongoing events using is/am/are + verb-ing.",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "Habit: 'She walks.' Ongoing: 'She is walking.'"
  },
  "Past Tense": {
    topic: "Past Tense",
    title: "Expressing the Past",
    explanation: "Past tense describes completed actions. Regular verbs add -ed (studied, walked). Irregular verbs change form completely (went, wrote, bought).",
    imageSrc: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&auto=format&fit=crop&q=60",
    example: "Simple past of go is went: 'We went to the zoo yesterday.'"
  },
  "Future Tense": {
    topic: "Future Tense",
    title: "Expressing Future Events",
    explanation: "Future tense expresses actions that will happen later. It is formed using the helping verb 'will' followed by the base form of the verb.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "'We will play cricket tomorrow.' or 'It will rain later.'"
  },

  // --- Sentence Structure ---
  "Subject": {
    topic: "Subject",
    title: "Finding the Subject",
    explanation: "The subject of a sentence is the person, place, or thing that is performing the action or being described. It is the 'who' or 'what' of the sentence.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "In 'The happy dog barked', the subject is 'The happy dog'."
  },
  "Predicate": {
    topic: "Predicate",
    title: "Understanding Predicates",
    explanation: "The predicate is the part of the sentence that contains the verb and states something about the subject. It tells what the subject does or is.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "In 'The dog barked loudly at the mailman', the predicate is 'barked loudly at the mailman'."
  },
  "Punctuation": {
    topic: "Punctuation",
    title: "End Punctuation Marks",
    explanation: "Sentence boundaries are defined by end marks. Periods (.) end statements. Question marks (?) end interrogative sentences. Exclamation marks (!) end emotional outbursts.",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&auto=format&fit=crop&q=60",
    example: "Statement: 'I am happy.' Question: 'Are you happy?'"
  },

  // --- Punctuation Rules ---
  "Commas": {
    topic: "Commas",
    title: "Comma Usage Rules",
    explanation: "Commas represent brief pauses. Use them to separate items in a list, join independent clauses with a conjunction, or set off introductory phrases.",
    imageSrc: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848c?w=800&auto=format&fit=crop&q=60",
    example: "List: 'I bought pens, paper, and ink.'"
  },
  "Apostrophes": {
    topic: "Apostrophes",
    title: "Apostrophe Rules",
    explanation: "Apostrophes are used for possession (showing ownership) or contraction (joining words by replacing missing letters).",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "Possessive: 'Ravi's book.' Contraction: 'do not' becomes 'don't'."
  },
  "Capitalization": {
    topic: "Capitalization",
    title: "Rules of Capitalization",
    explanation: "Capitalize the first word of a sentence, the pronoun 'I', and proper nouns (names of people, specific places, days of the week, and months).",
    imageSrc: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=800&auto=format&fit=crop&q=60",
    example: "Correct: 'On Monday, I visited London with Tom.'"
  },

  // --- Synonyms & Antonyms ---
  "Similar Meanings": {
    topic: "Similar Meanings",
    title: "Synonyms: Words with Same Meaning",
    explanation: "Synonyms are different words that have the same or very similar meanings. They are useful for making writing more varied and interesting.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "'Glad', 'Happy', and 'Joyful' are synonyms."
  },
  "Opposite Meanings": {
    topic: "Opposite Meanings",
    title: "Antonyms: Words with Opposite Meaning",
    explanation: "Antonyms are words that have opposite meanings. Recognizing antonyms helps in contrasting concepts in reading.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "'Fast' and 'Slow' are antonyms."
  },
  "Context Clues": {
    topic: "Context Clues",
    title: "Finding Meanings through Context",
    explanation: "Context clues are hints found within a sentence or paragraph that help you define an unfamiliar word without looking it up in a dictionary.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "In 'The giant bird soared high above', 'soared' means flew, because it was in the sky."
  },

  // --- Jallianwala Bagh ---
  "Location & Context": {
    topic: "Location & Context",
    title: "Historical Context of Jallianwala Bagh",
    explanation: "Jallianwala Bagh is a public garden in Amritsar, Punjab. On 13 April 1919 (the festival of Baisakhi), a large public gathering assembled there to peacefully protest against colonial arrest laws.",
    imageSrc: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=60",
    example: "The gathering was completely peaceful, containing many families, women, and children."
  },
  "Rowlatt Act": {
    topic: "Rowlatt Act",
    title: "The Oppressive Rowlatt Act",
    explanation: "Passed in March 1919, the Rowlatt Act allowed the British colonial government to arrest and imprison any Indian without a warrant or a trial. This led to massive protests across India.",
    imageSrc: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60",
    example: "Indians called it the 'Black Act' because it completely stripped citizens of basic judicial rights."
  },
  "General Dyer": {
    topic: "General Dyer",
    title: "General Dyer's Actions",
    explanation: "Brigadier-General Reginald Dyer ordered British troops to block the only exit of Jallianwala Bagh and open fire on the trapped crowd without warning. Firing continued for 10 minutes until ammunition was exhausted.",
    imageSrc: "https://images.unsplash.com/photo-1585909693684-0b53b49e3d53?w=800&auto=format&fit=crop&q=60",
    example: "Dyer later admitted his goal was to create a 'moral effect' and strike terror into Punjab."
  },
  "Impact": {
    topic: "Impact",
    title: "Impact on India's Freedom Movement",
    explanation: "The tragedy outraged the nation. Mahatma Gandhi launched the Non-Cooperation Movement in protest. Rabindranath Tagore returned his British Knighthood title in protest of the brutality.",
    imageSrc: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=60",
    example: "This massacre was a major turning point, uniting all Indians in the struggle for absolute independence (Swaraj)."
  },
  "Investigation": {
    topic: "Investigation",
    title: "Hunter Commission & Retaliation",
    explanation: "The British government set up the Hunter Commission to investigate. Though Dyer was removed from duty, he faced no formal criminal punishment. Years later, Indian revolutionary Udham Singh assassinated Michael O'Dwyer (who approved Dyer's actions) in London in 1940.",
    imageSrc: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60",
    example: "Udham Singh took his revenge 21 years after the tragedy."
  },

  // --- The Revolt of 1857 ---
  "Causes": {
    topic: "Causes",
    title: "Causes of the 1857 Uprising",
    explanation: "The Revolt of 1857 was caused by years of economic exploitation, annexation of kingdoms (Doctrine of Lapse), and social discrimination by the East India Company. The immediate trigger was the introduction of greased cartridges in the army.",
    imageSrc: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=60",
    example: "Cartridges greased with animal fat offended both Hindu and Muslim sepoys."
  },
  "Key Leaders": {
    topic: "Key Leaders",
    title: "Leaders of the Revolt",
    explanation: "Key leaders included Mangal Pandey (who fired the first shot in Barrackpore), Rani Lakshmibai of Jhansi, Nana Sahib in Kanpur, Tatya Tope, and Mughal Emperor Bahadur Shah Zafar.",
    imageSrc: "https://images.unsplash.com/photo-1585909693684-0b53b49e3d53?w=800&auto=format&fit=crop&q=60",
    example: "Rani Lakshmibai led the fight with her famous war cry: 'Meri Jhansi nahi doongi!'"
  },
  "Outcomes": {
    topic: "Outcomes",
    title: "Consequences of the Revolt",
    explanation: "Although the British suppressed the revolt due to a lack of unified leadership, it marked the end of the East India Company's rule. Administration was transferred directly to the British Crown under Queen Victoria.",
    imageSrc: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60",
    example: "This event is often called India's First War of Independence."
  },

  // --- Indian Constitution ---
  "Drafting": {
    topic: "Drafting",
    title: "Drafting the Constitution",
    explanation: "The Constituent Assembly drafted the supreme law of India. Dr. Rajendra Prasad was the President of the Assembly, while Dr. B.R. Ambedkar acted as the Chairman of the Drafting Committee.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "The process took 2 years, 11 months, and 18 days to complete."
  },
  "Preamble": {
    topic: "Preamble",
    title: "The Preamble to the Constitution",
    explanation: "The Preamble is the introductory statement that sets out the guiding principles, goals, and values of the Constitution (Justice, Liberty, Equality, and Fraternity). It declares India to be Sovereign, Socialist, Secular, and Democratic Republic.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "The opening words: 'We, the People of India...' show that power lies with the citizens."
  },
  "Fundamental Rights": {
    topic: "Fundamental Rights",
    title: "Fundamental Rights of Citizens",
    explanation: "Guaranteed in Part III, Fundamental Rights ensure civil liberties for all citizens, protecting them from state overreach (e.g., Right to Equality, Right to Freedom).",
    imageSrc: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60",
    example: "Article 32 provides the Right to Constitutional Remedies, allowing citizens to move the Supreme Court."
  },

  // --- French Revolution ---
  "Three Estates": {
    topic: "Three Estates",
    title: "The French Estate System",
    explanation: "Under the Old Regime, French society was split into three estates: Clergy (First), Nobility (Second), and Commoners (Third). The Third Estate made up 98% of the population but bore the entire tax burden.",
    imageSrc: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&auto=format&fit=crop&q=60",
    example: "Peasants and urban workers belonged to the Third Estate and paid high taxes."
  },
  "Bastille": {
    topic: "Bastille",
    title: "Storming the Bastille",
    explanation: "On 14 July 1789, angry Parisian commoners stormed the Bastille, a medieval fortress and prison. This event symbolized the destruction of the King's absolute power and marked the start of the Revolution.",
    imageSrc: "https://images.unsplash.com/photo-1585909693684-0b53b49e3d53?w=800&auto=format&fit=crop&q=60",
    example: "Today, 14 July is celebrated as France's National Day (Bastille Day)."
  },
  "Napoleon": {
    topic: "Napoleon",
    title: "The Rise of Napoleon Bonaparte",
    explanation: "Following the chaos of the revolution, military general Napoleon Bonaparte seized power and crowned himself Emperor of France in 1804. He introduced the Napoleonic Code but was finally defeated at the Battle of Waterloo in 1815.",
    imageSrc: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&auto=format&fit=crop&q=60",
    example: "The Napoleonic Code standardized laws, property rights, and abolished feudalism."
  },

  // --- Industrial Revolution ---
  "Steam Engine": {
    topic: "Steam Engine",
    title: "Powering the Revolution",
    explanation: "The Industrial Revolution began in Britain in the late 1700s. The improvement of the steam engine by James Watt allowed factories to move away from rivers and be powered by coal, accelerating mechanization.",
    imageSrc: "https://images.unsplash.com/photo-1596495578065-6e076b888b83?w=800&auto=format&fit=crop&q=60",
    example: "Steam engines powered weaving machines, coal pumps, and eventually trains."
  },
  "Factories": {
    topic: "Factories",
    title: "Rise of the Factory System",
    explanation: "Machinery replaced manual cottage labor, giving rise to the factory system. In textile factories, inventions like the Spinning Jenny allowed rapid mass production of clothes at lower costs.",
    imageSrc: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=60",
    example: "Hand looms were replaced by steam-driven power looms in giant mills."
  },
  "Urban Growth": {
    topic: "Urban Growth",
    title: "Urbanisation and Labor Issues",
    explanation: "The demand for factory labor led to rapid urbanisation, as rural families migrated to cities. Early industrial cities were overcrowded, with poor sanitation, and workers faced long hours, dangerous conditions, and child labor.",
    imageSrc: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=60",
    example: "Slum housing and pollution from coal smoke became standard features of industrial towns."
  }
};
