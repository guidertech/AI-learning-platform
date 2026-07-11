// src/lib/mock/chapterQuizzes.ts
// MCQ data for Prerequisite and Chapter-End tests per chapter

export type MCQ = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;       // 0-based index of correct option
  explanation: string;        // shown after answering
  topic: string;              // topic label for grouping on results page
  topicLabel?: string;
};

export type ChapterQuizData = {
  chapterId: string;
  chapterTitle: string;
  prerequisite: MCQ[];        // 10 diagnostic questions
  chapterEnd: MCQ[];          // 5 comprehensive questions
};

export const chapterQuizzes: ChapterQuizData[] = [

  // ─── MATHEMATICS (5 Chapters) ─────────────────────────────────────────────

  {
    chapterId: "ch-1",
    chapterTitle: "Number Systems",
    prerequisite: [
      { id: "ch1-pre-1", topic: "Place Values", question: "5,432 mein '4' ka place value kya hai?", options: ["4", "40", "400", "4000"], correctIndex: 2, explanation: "Hundreds ki jagah par hai, isliye 4 × 100 = 400." },
      { id: "ch1-pre-2", topic: "Place Values", question: "47,852 mein '7' ka place value kya hai?", options: ["7", "70", "700", "7,000"], correctIndex: 3, explanation: "7 thousands ki jagah hai, isliye 7,000." },
      { id: "ch1-pre-3", topic: "Place Values", question: "3,60,000 mein '6' ka place value kya hai?", options: ["6,000", "60,000", "600", "6"], correctIndex: 1, explanation: "6 ten-thousands ki jagah par hai — 60,000." },
      { id: "ch1-pre-4", topic: "Comparing Numbers", question: "Kaunsi sankhya sabse badi hai?", options: ["9,090", "9,900", "9,009", "9,099"], correctIndex: 1, explanation: "9,900 sabse badi hai." },
      { id: "ch1-pre-5", topic: "Comparing Numbers", question: "9,876 aur 9,867 mein se kaun bada hai?", options: ["9,867", "9,876", "Dono barabar", "Pata nahi"], correctIndex: 1, explanation: "Tens place mein 7 > 6, isliye 9,876 > 9,867." },
      { id: "ch1-pre-6", topic: "Comparing Decimals", question: "0.45 aur 0.5 mein se kaun bada hai?", options: ["0.45", "0.5", "Barabar", "Pata nahi"], correctIndex: 1, explanation: "0.5 = 0.50, jo 0.45 se bada hai." },
      { id: "ch1-pre-7", topic: "Comparing Decimals", question: "2.08 aur 2.8 mein se kaun bada hai?", options: ["2.08", "2.8", "Barabar", "Impossible"], correctIndex: 1, explanation: "2.8 = 2.80, jo 2.08 se bada hai." },
      { id: "ch1-pre-8", topic: "Rounding", question: "3.7 ko nearest whole number par round karein?", options: ["3", "4", "3.5", "37"], correctIndex: 1, explanation: ".7 >= .5 hai, isliye upar round karenge — answer 4." },
      { id: "ch1-pre-9", topic: "Rounding", question: "1,245 ko nearest hundred par round karein?", options: ["1,200", "1,300", "1,250", "1,000"], correctIndex: 0, explanation: "Tens digit = 4 < 5, isliye 1,200." },
      { id: "ch1-pre-10", topic: "Large Numbers", question: "Kitne lakhs mein 1 crore hota hai?", options: ["10", "100", "1,000", "10,000"], correctIndex: 1, explanation: "1 crore = 100 lakhs." },
    ],
    chapterEnd: [
      { id: "ch1-end-1", topic: "Place Values", question: "47,852 mein '7' ka place value kya hai?", options: ["7", "70", "700", "7,000"], correctIndex: 3, explanation: "7 thousands place hai, isliye 7,000." },
      { id: "ch1-end-2", topic: "Comparing Decimals", question: "0.45 aur 0.5 mein se kaun bada hai?", options: ["0.45", "0.5", "Barabar", "Pata nahi"], correctIndex: 1, explanation: "0.5 = 0.50, jo 0.45 se bada hai." },
      { id: "ch1-end-3", topic: "Rounding", question: "3.7 ko nearest whole number par round karein?", options: ["3", "4", "3.5", "37"], correctIndex: 1, explanation: ".7 >= .5 hai, isliye 4." },
      { id: "ch1-end-4", topic: "Large Numbers", question: "Kitne lakhs mein 1 crore hota hai?", options: ["10", "100", "1,000", "10,000"], correctIndex: 1, explanation: "1 crore = 100 lakhs." },
      { id: "ch1-end-5", topic: "Comparing Decimals", question: "2.08 < 2.8 — yeh sahi hai ya galat?", options: ["Sahi (True)", "Galat (False)", "Barabar", "Impossible"], correctIndex: 0, explanation: "2.8 has higher tenths than 2.08, so 2.08 < 2.8 is correct." },
    ],
  },
  {
    chapterId: "ch-2",
    chapterTitle: "Additions & Subtractions",
    prerequisite: [
      { id: "ch2-pre-1", topic: "Basic Addition", question: "345 + 278 = ?", options: ["513", "623", "633", "613"], correctIndex: 1, explanation: "345 + 278 = 623." },
      { id: "ch2-pre-2", topic: "Basic Addition", question: "1,234 + 5,678 = ?", options: ["6,902", "6,912", "6,812", "7,012"], correctIndex: 1, explanation: "1,234 + 5,678 = 6,912." },
      { id: "ch2-pre-3", topic: "Basic Addition", question: "4,567 + 3,845 = ?", options: ["8,312", "8,412", "7,412", "8,402"], correctIndex: 1, explanation: "4,567 + 3,845 = 8,412." },
      { id: "ch2-pre-4", topic: "Basic Subtraction", question: "500 - 237 = ?", options: ["263", "273", "253", "367"], correctIndex: 0, explanation: "500 - 237 = 263." },
      { id: "ch2-pre-5", topic: "Basic Subtraction", question: "10,000 - 4,563 = ?", options: ["5,437", "5,447", "6,437", "5,337"], correctIndex: 0, explanation: "10,000 - 4,563 = 5,437." },
      { id: "ch2-pre-6", topic: "Basic Subtraction", question: "Ravi ke paas Rs.5,000 the. Usne Rs.1,375 kharch kiye. Kitne bache?", options: ["Rs.3,625", "Rs.3,725", "Rs.4,625", "Rs.3,525"], correctIndex: 0, explanation: "5,000 - 1,375 = 3,625." },
      { id: "ch2-pre-7", topic: "Column Method", question: "Kaunsa sabse aasaan tarika hai bade numbers add karne ka?", options: ["Column method", "Guess karo", "Calculator", "Skip karo"], correctIndex: 0, explanation: "Column method vertical calculation aasaan banata hai." },
      { id: "ch2-pre-8", topic: "Word Problems", question: "Ek school mein 1,250 ladke aur 1,175 ladkiyan hain. Total kitne students?", options: ["2,425", "2,325", "2,415", "2,375"], correctIndex: 0, explanation: "1,250 + 1,175 = 2,425." },
      { id: "ch2-pre-9", topic: "Word Problems", question: "1,234 + 5,678 + 2,345 = ?", options: ["9,257", "9,157", "8,257", "9,267"], correctIndex: 0, explanation: "Add three values gives 9,257." },
      { id: "ch2-pre-10", topic: "Column Method", question: "Column addition mein carry kab karte hain?", options: ["Jab total 5 se zyada ho", "Jab total 10 ya zyada ho", "Kabhi nahi", "Sirf hundreds mein"], correctIndex: 1, explanation: "Jab values 10 cross karein, tab tens place carry forward hota hai." },
    ],
    chapterEnd: [
      { id: "ch2-end-1", topic: "Basic Addition", question: "4,567 + 3,845 = ?", options: ["8,312", "8,412", "7,412", "8,402"], correctIndex: 1, explanation: "4,567 + 3,845 = 8,412." },
      { id: "ch2-end-2", topic: "Basic Subtraction", question: "10,000 - 4,563 = ?", options: ["5,437", "5,447", "6,437", "5,337"], correctIndex: 0, explanation: "10,000 - 4,563 = 5,437." },
      { id: "ch2-end-3", topic: "Word Problems", question: "School total: 1,250 + 1,175 = ?", options: ["2,425", "2,325", "2,415", "2,375"], correctIndex: 0, explanation: "Total is 2,425." },
      { id: "ch2-end-4", topic: "Word Problems", question: "5,000 - 1,375 = ?", options: ["Rs.3,625", "Rs.3,725", "Rs.4,625", "Rs.3,525"], correctIndex: 0, explanation: "Subtract value is Rs.3,625." },
      { id: "ch2-end-5", topic: "Column Method", question: "1,234 + 5,678 + 2,345 = ?", options: ["9,257", "9,157", "8,257", "9,267"], correctIndex: 0, explanation: "Sum is 9,257." },
    ],
  },
  {
    chapterId: "ch-3",
    chapterTitle: "Multiplication & Division",
    prerequisite: [
      { id: "ch3-pre-1", topic: "Multiplication Tables", question: "7 x 8 = ?", options: ["54", "56", "63", "48"], correctIndex: 1, explanation: "7 x 8 = 56." },
      { id: "ch3-pre-2", topic: "Multiplication Tables", question: "9 x 6 = ?", options: ["52", "54", "56", "48"], correctIndex: 1, explanation: "9 x 6 = 54." },
      { id: "ch3-pre-3", topic: "Multiplication Tables", question: "12 x 7 = ?", options: ["74", "84", "94", "76"], correctIndex: 1, explanation: "12 x 7 = 84." },
      { id: "ch3-pre-4", topic: "Division Basics", question: "48 / 6 = ?", options: ["6", "7", "8", "9"], correctIndex: 2, explanation: "48 / 6 = 8." },
      { id: "ch3-pre-5", topic: "Division Basics", question: "125 / 5 = ?", options: ["20", "25", "30", "15"], correctIndex: 1, explanation: "125 / 5 = 25." },
      { id: "ch3-pre-6", topic: "Division with Remainders", question: "47 / 4 ka quotient aur remainder kya hoga?", options: ["Q=11, R=3", "Q=12, R=1", "Q=10, R=7", "Q=11, R=4"], correctIndex: 0, explanation: "4x11=44, 47-44=3. Quotient=11, remainder=3." },
      { id: "ch3-pre-7", topic: "Division with Remainders", question: "Division ka reverse operation kya hai?", options: ["Addition", "Subtraction", "Multiplication", "Squaring"], correctIndex: 2, explanation: "Multiplication is the reverse of division." },
      { id: "ch3-pre-8", topic: "Factor Trees", question: "24 ka factor tree mein prime factors kaunse hain?", options: ["2, 3", "2, 12", "4, 6", "1, 24"], correctIndex: 0, explanation: "24 = 2 x 2 x 2 x 3. Prime factors are 2 and 3." },
      { id: "ch3-pre-9", topic: "Word Problems", question: "48 seats in 6 buses. Total?", options: ["264", "288", "294", "278"], correctIndex: 1, explanation: "48 x 6 = 288." },
      { id: "ch3-pre-10", topic: "Word Problems", question: "135 students in 5 equal groups?", options: ["25", "27", "30", "33"], correctIndex: 1, explanation: "135 / 5 = 27." },
    ],
    chapterEnd: [
      { id: "ch3-end-1", topic: "Division Basics", question: "125 / 5 = ?", options: ["20", "25", "30", "15"], correctIndex: 1, explanation: "Answer is 25." },
      { id: "ch3-end-2", topic: "Division with Remainders", question: "47 / 4 = ?", options: ["Q=11, R=3", "Q=12, R=1", "Q=10, R=7", "Q=11, R=4"], correctIndex: 0, explanation: "Quotient=11, Remainder=3." },
      { id: "ch3-end-3", topic: "Factor Trees", question: "Prime factors of 24?", options: ["2, 3", "2, 12", "4, 6", "1, 24"], correctIndex: 0, explanation: "Factors are 2 and 3." },
      { id: "ch3-end-4", topic: "Word Problems", question: "48 x 6 = ?", options: ["264", "288", "294", "278"], correctIndex: 1, explanation: "Answer is 288." },
      { id: "ch3-end-5", topic: "Word Problems", question: "135 / 5 = ?", options: ["25", "27", "30", "33"], correctIndex: 1, explanation: "Result is 27." },
    ],
  },
  {
    chapterId: "ch-4",
    chapterTitle: "Fractions & Decimals",
    prerequisite: [
      { id: "ch4-pre-1", topic: "Fraction Basics", question: "1/2 mein '2' kya represent karta hai?", options: ["Hisse liye", "Total parts", "Apples count", "Nothing"], correctIndex: 1, explanation: "Denominator total equal parts represent karta hai." },
      { id: "ch4-pre-2", topic: "Fraction Basics", question: "Pizza has 8 slices. You ate 3. Fraction?", options: ["3/5", "8/3", "3/8", "5/8"], correctIndex: 2, explanation: "3 parts out of 8 = 3/8." },
      { id: "ch4-pre-3", topic: "Equivalent Fractions", question: "1/4 = ?/8", options: ["1", "2", "3", "4"], correctIndex: 1, explanation: "Multiply top & bottom by 2 → 2/8." },
      { id: "ch4-pre-4", topic: "Equivalent Fractions", question: "6/8 in simplest form?", options: ["3/4", "2/3", "1/2", "4/6"], correctIndex: 0, explanation: "Divide by 2 → 3/4." },
      { id: "ch4-pre-5", topic: "Comparing Fractions", question: "2/3 aur 3/4 mein se kaun bada hai?", options: ["2/3", "3/4", "Barabar", "Pata nahi"], correctIndex: 1, explanation: "2/3 = 8/12, 3/4 = 9/12. 3/4 is larger." },
      { id: "ch4-pre-6", topic: "Adding Fractions", question: "1/2 + 1/4 = ?", options: ["2/6", "3/4", "2/4", "1/6"], correctIndex: 1, explanation: "2/4 + 1/4 = 3/4." },
      { id: "ch4-pre-7", topic: "Adding Fractions", question: "1 - 3/8 = ?", options: ["2/8", "5/8", "4/8", "3/5"], correctIndex: 1, explanation: "8/8 - 3/8 = 5/8." },
      { id: "ch4-pre-8", topic: "Mixed Numbers", question: "2 3/4 in improper form?", options: ["11/4", "9/4", "8/4", "6/4"], correctIndex: 0, explanation: "(2x4 + 3)/4 = 11/4." },
      { id: "ch4-pre-9", topic: "Mixed Numbers", question: "9/4 mixed number form?", options: ["2 1/4", "2 1/2", "1 3/4", "3 1/4"], correctIndex: 0, explanation: "9/4 = 2 1/4." },
      { id: "ch4-pre-10", topic: "Comparing Fractions", question: "1/3 aur 1/4 mein se kaun bada hai?", options: ["1/4", "1/3", "Barabar", "Pata nahi"], correctIndex: 1, explanation: "Smaller denominator means larger fraction: 1/3 > 1/4." },
    ],
    chapterEnd: [
      { id: "ch4-end-1", topic: "Comparing Fractions", question: "2/3 vs 3/4?", options: ["2/3", "3/4", "Barabar", "Pata nahi"], correctIndex: 1, explanation: "3/4 is larger." },
      { id: "ch4-end-2", topic: "Adding Fractions", question: "1/2 + 1/4 = ?", options: ["2/6", "3/4", "2/4", "1/6"], correctIndex: 1, explanation: "Sum is 3/4." },
      { id: "ch4-end-3", topic: "Mixed Numbers", question: "2 3/4 to improper?", options: ["11/4", "9/4", "8/4", "6/4"], correctIndex: 0, explanation: "(2x4)+3 = 11/4." },
      { id: "ch4-end-4", topic: "Mixed Numbers", question: "9/4 to mixed?", options: ["2 1/4", "2 1/2", "1 3/4", "3 1/4"], correctIndex: 0, explanation: "Result is 2 1/4." },
      { id: "ch4-end-5", topic: "Equivalent Fractions", question: "6/8 simplest?", options: ["3/4", "2/3", "1/2", "4/6"], correctIndex: 0, explanation: "Simplest form is 3/4." },
    ],
  },
  {
    chapterId: "ch-5",
    chapterTitle: "Data Handling",
    prerequisite: [
      { id: "ch5-pre-1", topic: "Bar Graphs", question: "Bar graph mein horizontal axis kya represent karti hai?", options: ["Categories", "Values", "Scale", "Title"], correctIndex: 0, explanation: "Horizontal axis par labels/categories sthit hote hain." },
      { id: "ch5-pre-2", topic: "Bar Graphs", question: "Bar graph mein bars ki height kya represent karti hai?", options: ["Category Name", "Data Values", "Colors", "Gridlines"], correctIndex: 1, explanation: "Height data values ke magnitude ko represent karti hai." },
      { id: "ch5-pre-3", topic: "Bar Graphs", question: "Bar graphs kis category ka data represent karne ke liye best hain?", options: ["Discrete", "Continuous", "Infinite", "Formulas"], correctIndex: 0, explanation: "Discrete separate classes/categories ke liye bar graphs best hain." },
      { id: "ch5-pre-4", topic: "Averages & Mean", question: "5, 10, and 15 ka sum kya hai?", options: ["25", "30", "35", "40"], correctIndex: 1, explanation: "5 + 10 + 15 = 30." },
      { id: "ch5-pre-5", topic: "Averages & Mean", question: "5, 10, aur 15 ka average (mean) kya hoga?", options: ["5", "10", "15", "30"], correctIndex: 1, explanation: "Sum = 30. Total values = 3. 30/3 = 10." },
      { id: "ch5-pre-6", topic: "Averages & Mean", question: "Mean kaise calculate karte hain?", options: ["Sum / Count", "Sum * Count", "Subtract numbers", "Multiply all"], correctIndex: 0, explanation: "Values ko sum karke total count se divide karte hain." },
      { id: "ch5-pre-7", topic: "Averages & Mean", question: "Agar 4 numbers ka average 5 hai, to unka sum kya hoga?", options: ["9", "20", "15", "25"], correctIndex: 1, explanation: "Average = Sum / Count, so Sum = Average * Count = 5 * 4 = 20." },
      { id: "ch5-pre-8", topic: "Bar Graphs", question: "Double bar graph kis cheez ke liye use hota hai?", options: ["Single data set", "Comparing two data sets", "Drawing circles", "Addition"], correctIndex: 1, explanation: "Dono sets ko side-by-side compare karne ke liye double bar graph use hota." },
      { id: "ch5-pre-9", topic: "Bar Graphs", question: "Legend ka kya role hota hai graph mein?", options: ["Describe colors/bars", "Calculate values", "Exit graph", "Nothing"], correctIndex: 0, explanation: "Legend bars ki categorizations aur color-coding ko clear karta hai." },
      { id: "ch5-pre-10", topic: "Averages & Mean", question: "10, 10, 10, 10 ka mean kya hai?", options: ["40", "10", "4", "0"], correctIndex: 1, explanation: "Sare numbers same hain to mean bhi 10 hi hoga." },
    ],
    chapterEnd: [
      { id: "ch5-end-1", topic: "Bar Graphs", question: "Bar height key indicator hai for?", options: ["Values", "Colors", "Sizes", "Names"], correctIndex: 0, explanation: "Height stands for values in a bar graph." },
      { id: "ch5-end-2", topic: "Averages & Mean", question: "Mean of 8, 12, 10 is?", options: ["10", "30", "9", "12"], correctIndex: 0, explanation: "(8+12+10)/3 = 30/3 = 10." },
      { id: "ch5-end-3", topic: "Averages & Mean", question: "Sum of values / Count = ?", options: ["Mean", "Median", "Mode", "Sum"], correctIndex: 0, explanation: "This is the formula for calculating Mean." },
      { id: "ch5-end-4", topic: "Bar Graphs", question: "Two data sets are compared using?", options: ["Double bar graph", "Single bar graph", "Line only", "Pie chart"], correctIndex: 0, explanation: "Double bar graphs allow direct comparison." },
      { id: "ch5-end-5", topic: "Averages & Mean", question: "Mean of 1, 2, 3, 4, 5?", options: ["3", "15", "5", "2"], correctIndex: 0, explanation: "Sum = 15. Count = 5. Mean = 15/5 = 3." },
    ],
  },

  // ─── SCIENCE (5 Chapters) ──────────────────────────────────────────────────

  {
    chapterId: "ch-sci-1",
    chapterTitle: "Plants & Photosynthesis",
    prerequisite: [
      { id: "sci1-pre-1", topic: "Photosynthesis Basics", question: "Paudhe apna khana kahan banate hain?", options: ["Roots mein", "Patton mein", "Phoolon mein", "Stem mein"], correctIndex: 1, explanation: "Patton mein chlorophyll hota hai jo photosynthesis karta hai." },
      { id: "sci1-pre-2", topic: "Photosynthesis Basics", question: "Photosynthesis ke liye kya zaroori hai?", options: ["Sirf paani", "Sirf sunlight", "Sunlight, CO2 aur H2O", "Oxygen aur sugar"], correctIndex: 2, explanation: "Photosynthesis ke liye sunlight, carbon dioxide aur water zaroori hain." },
      { id: "sci1-pre-3", topic: "Chlorophyll", question: "Patte ka green color kis pigment ki wajah se hai?", options: ["Chlorophyll", "Hemoglobin", "Melanin", "Xanthophyll"], correctIndex: 0, explanation: "Chlorophyll pigment patto ko green rang deta hai." },
      { id: "sci1-pre-4", topic: "Chlorophyll", question: "Chlorophyll cells ke kis part mein sthit hai?", options: ["Mitochondria", "Nucleus", "Chloroplast", "Cell Wall"], correctIndex: 2, explanation: "Chlorophyll chloroplast organelle mein hota hai." },
      { id: "sci1-pre-5", topic: "Photosynthesis Equation", question: "Photosynthesis equation output?", options: ["Glucose + O2", "Water + Sunlight", "CO2 + H2O", "Starch + CO2"], correctIndex: 0, explanation: "CO2 + H2O + Light → Glucose + Oxygen." },
      { id: "sci1-pre-6", topic: "Photosynthesis Equation", question: "Photosynthesis mein raw materials kya hain?", options: ["Glucose aur Oxygen", "CO2 aur Water", "Light aur Sugar", "Starch"], correctIndex: 1, explanation: "Carbon dioxide aur Water raw materials hote hain." },
      { id: "sci1-pre-7", topic: "Plant Respiration", question: "Paudhe respiration mein kya release karte hain?", options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"], correctIndex: 1, explanation: "Respiration mein paudhe, animals ki tarah, CO2 release karte hain." },
      { id: "sci1-pre-8", topic: "Plant Respiration", question: "Respiration kab hoti hai?", options: ["Sirf din mein", "Sirf raat ko", "24 ghante (Day & Night)", "Kabhi nahi"], correctIndex: 2, explanation: "Respiration cell survival ke liye 24 ghante chalti hai." },
      { id: "sci1-pre-9", topic: "Chlorophyll", question: "Chlorophyll kaunsi light absorb nahi karta?", options: ["Red", "Blue", "Green", "UV"], correctIndex: 2, explanation: "Green light reflect karta hai, isliye green dikhta hai." },
      { id: "sci1-pre-10", topic: "Photosynthesis Basics", question: "Sunlight energy ko chemical energy mein kaun convert karta hai?", options: ["Roots", "Chlorophyll", "Stomata", "Starch"], correctIndex: 1, explanation: "Chlorophyll light trap karke chemical process shuru karta hai." },
    ],
    chapterEnd: [
      { id: "sci1-end-1", topic: "Photosynthesis Equation", question: "Equation yields glucose and?", options: ["Oxygen", "Nitrogen", "Hydrogen", "Carbon"], correctIndex: 0, explanation: "Produces Oxygen as byproduct." },
      { id: "sci1-end-2", topic: "Chlorophyll", question: "Where is chlorophyll housed?", options: ["Chloroplast", "Nucleus", "Ribosome", "Cell wall"], correctIndex: 0, explanation: "Inside chloroplasts." },
      { id: "sci1-end-3", topic: "Plant Respiration", question: "Respiration occurs when?", options: ["All the time", "Day only", "Night only", "Never"], correctIndex: 0, explanation: "Respiration happens continuously." },
      { id: "sci1-end-4", topic: "Photosynthesis Equation", question: "CO2 enters via?", options: ["Stomata", "Roots", "Flowers", "Stem"], correctIndex: 0, explanation: "Pores called stomata absorb CO2." },
      { id: "sci1-end-5", topic: "Plant Respiration", question: "Gas released during respiration?", options: ["CO2", "Oxygen", "Water vapor", "Nitrogen"], correctIndex: 0, explanation: "Carbon dioxide is released." },
    ],
  },
  {
    chapterId: "ch-sci-2",
    chapterTitle: "Forces & Motion",
    prerequisite: [
      { id: "sci2-pre-1", topic: "Gravity", question: "Gravity kya hai?", options: ["Push force", "Pull force that attracts objects", "Magnetic force", "Frictional force"], correctIndex: 1, explanation: "Gravity do objects ke beech ka attractive pull force hai." },
      { id: "sci2-pre-2", topic: "Gravity", question: "Earth par har object ko center ki taraf kaun khinchta hai?", options: ["Friction", "Gravity", "Air resistance", "Magnetism"], correctIndex: 1, explanation: "Earth ki gravity hume niche khinchti hai." },
      { id: "sci2-pre-3", topic: "Friction", question: "Friction kya karti hai?", options: ["Speed badhati hai", "Motion ko oppose/slow karti hai", "Direction badalti hai", "Nothing"], correctIndex: 1, explanation: "Friction sliding surface ke motion ko slow down karti hai." },
      { id: "sci2-pre-4", topic: "Friction", question: "Kaunsi surface par friction sabse kam hoga?", options: ["Ice (Baraf)", "Road", "Sandpaper", "Carpet"], correctIndex: 0, explanation: "Smooth surfaces jaise ice par friction sabse kam hota hai." },
      { id: "sci2-pre-5", topic: "Newton's Laws", question: "Force ka unit kya hai?", options: ["Kilogram", "Meter", "Newton", "Joule"], correctIndex: 2, explanation: "Force Newton (N) mein measure hota hai." },
      { id: "sci2-pre-6", topic: "Newton's Laws", question: "Mass badhne par force standard kya hoga to move it?", options: ["Kam force lagega", "Zyada force lagega", "Same force", "Zero force"], correctIndex: 1, explanation: "Newton's second law kehta hai F = ma, mass badhne par dynamic push force zyada chahiye." },
      { id: "sci2-pre-7", topic: "Friction", question: "Kaunsa oil use hota hai machinery parts mein friction kam karne ke liye?", options: ["Water", "Lubricant/Grease", "Acid", "Glue"], correctIndex: 1, explanation: "Lubricants friction reduce karte hain." },
      { id: "sci2-pre-8", topic: "Gravity", question: "Kya Moon par gravity Earth se kam hai?", options: ["Haan (Yes)", "Nahi (No)", "Same hai", "Pata nahi"], correctIndex: 0, explanation: "Moon ka mass Earth se kam hai, isliye wahan gravity Earth ka 1/6th hai." },
      { id: "sci2-pre-9", topic: "Newton's Laws", question: "Action and Reaction forces are always?", options: ["Equal and opposite", "Unequal", "In same direction", "Zero"], correctIndex: 0, explanation: "Newton's third law: Every action has equal and opposite reaction." },
      { id: "sci2-pre-10", topic: "Newton's Laws", question: "Balanced forces object ka state kya rakhti hain?", options: ["No change in motion", "Speed up", "Slow down", "Change direction"], correctIndex: 0, explanation: "Balanced force net value zero karti hai, isliye motion state change nahi hoti." },
    ],
    chapterEnd: [
      { id: "sci2-end-1", topic: "Gravity", question: "Force pulling down objects?", options: ["Friction", "Gravity", "Buoyancy", "Tension"], correctIndex: 1, explanation: "Gravity pulls everything down." },
      { id: "sci2-end-2", topic: "Friction", question: "Friction resists?", options: ["Motion", "Rest", "Colors", "Gravity"], correctIndex: 0, explanation: "It opposes motion between surfaces." },
      { id: "sci2-end-3", topic: "Newton's Laws", question: "Newton's unit measures?", options: ["Mass", "Force", "Velocity", "Time"], correctIndex: 1, explanation: "Force unit is Newton." },
      { id: "sci2-end-4", topic: "Friction", question: "Smooth ice has?", options: ["Low friction", "High friction", "No gravity", "Extreme heat"], correctIndex: 0, explanation: "Very smooth means low friction resistance." },
      { id: "sci2-end-5", topic: "Newton's Laws", question: "Action-reaction pairs are?", options: ["Equal & opposite", "Unbalanced", "Parallel", "Zero"], correctIndex: 0, explanation: "They are equal and opposite." },
    ],
  },
  {
    chapterId: "ch-sci-3",
    chapterTitle: "Heat & Temperature",
    prerequisite: [
      { id: "sci3-pre-1", topic: "Conduction", question: "Spoon hot tea mein rakhne par hot ho jati hai, kis process se?", options: ["Conduction", "Convection", "Radiation", "Insulation"], correctIndex: 0, explanation: "Solid objects mein molecular contact se heat transfer conduction hai." },
      { id: "sci3-pre-2", topic: "Conduction", question: "Kaunsa material good conductor of heat hai?", options: ["Wood", "Plastic", "Copper (Metal)", "Glass"], correctIndex: 2, explanation: "Metals good conductors hote hain." },
      { id: "sci3-pre-3", topic: "Convection", question: "Liquid aur gases mein heat transfer kaise hota hai?", options: ["Conduction", "Convection", "Radiation", "Insulation"], correctIndex: 1, explanation: "Fluids/gases ke molecules circulation movement se heat convection transfer karte hain." },
      { id: "sci3-pre-4", topic: "Convection", question: "Hot air hamesha kahan jati hai?", options: ["Upar (Rises)", "Niche (Sinks)", "Side mein", "Nowhere"], correctIndex: 0, explanation: "Hot air lighter hoti hai isliye convection process se upar uthti hai." },
      { id: "sci3-pre-5", topic: "Radiation", question: "Sun ki heat Earth tak bina medium kaise aati hai?", options: ["Conduction", "Convection", "Radiation", "Wind"], correctIndex: 2, explanation: "Vacuum mein electromagnetic waves ke zariye heat transfer radiation kehlata hai." },
      { id: "sci3-pre-6", topic: "Radiation", question: "Black color heat ko kya karta hai?", options: ["Reflect", "Absorb", "Release", "Transmit"], correctIndex: 1, explanation: "Dark colors heat radiation absorb karte hain." },
      { id: "sci3-pre-7", topic: "Thermometers", question: "Thermometer mein kaunsa liquid use hota hai general?", options: ["Water", "Mercury", "Alcohol", "Oil"], correctIndex: 1, explanation: "Mercury high thermal expansion aur shiny look ke liye choose hota hai." },
      { id: "sci3-pre-8", topic: "Thermometers", question: "Water ka boiling point Celsius scale par kya hai?", options: ["0 C", "100 C", "37 C", "212 C"], correctIndex: 1, explanation: "Celsius scale par water 100 degrees par boil hota hai." },
      { id: "sci3-pre-9", topic: "Thermometers", question: "Water ka freezing point kya hai?", options: ["0 C", "100 C", "32 C", "10 C"], correctIndex: 0, explanation: "0 C par water freeze hota hai." },
      { id: "sci3-pre-10", topic: "Conduction", question: "Insulators ka kya role hai?", options: ["Allow heat flow", "Prevent/slow down heat flow", "Generate heat", "Cool down things"], correctIndex: 1, explanation: "Insulators poor conductors hote hain jo heat transfer block karte hain." },
    ],
    chapterEnd: [
      { id: "sci3-end-1", topic: "Conduction", question: "Metals transfer heat via?", options: ["Conduction", "Convection", "Radiation", "Vacuum"], correctIndex: 0, explanation: "Direct touch conduction transfer." },
      { id: "sci3-end-2", topic: "Convection", question: "Warm fluids rise due to?", options: ["Convection", "Conduction", "Radiation", "Density drop"], correctIndex: 0, explanation: "Warm parts expand and rise (convection)." },
      { id: "sci3-end-3", topic: "Radiation", question: "Sunlight energy transfers by?", options: ["Radiation", "Touch", "Air molecules", "Water"], correctIndex: 0, explanation: "Radiation requires no medium." },
      { id: "sci3-end-4", topic: "Thermometers", question: "Boiling water is at?", options: ["100 C", "0 C", "50 C", "37 C"], correctIndex: 0, explanation: "100 C is standard boiling point." },
      { id: "sci3-end-5", topic: "Thermometers", question: "Mercury is used because?", options: ["It expands evenly", "It is cheap", "It is blue", "It is solid"], correctIndex: 0, explanation: "Mercury expands predictably with heat." },
    ],
  },
  {
    chapterId: "ch-sci-4",
    chapterTitle: "The Solar System",
    prerequisite: [
      { id: "sci4-pre-1", topic: "Planets", question: "Solar System ka center kya hai?", options: ["Earth", "Sun", "Jupiter", "Moon"], correctIndex: 1, explanation: "Sun gravity center hai jiske charo taraf orbits revolving hain." },
      { id: "sci4-pre-2", topic: "Planets", question: "Kaunsa planet size mein sabse bada hai?", options: ["Mars", "Saturn", "Jupiter", "Neptune"], correctIndex: 2, explanation: "Jupiter largest gaseous planet hai." },
      { id: "sci4-pre-3", topic: "Planets", question: "Red Planet kise kehte hain?", options: ["Mercury", "Mars", "Venus", "Uranus"], correctIndex: 1, explanation: "Mars has iron-rich red soil." },
      { id: "sci4-pre-4", topic: "Moon Phases", question: "Moonlight kya hai actual mein?", options: ["Moon ki apni light", "Reflected Sunlight", "Earth shine", "Stars light"], correctIndex: 1, explanation: "Moon Sun's light ko reflect karta hai." },
      { id: "sci4-pre-5", topic: "Moon Phases", question: "Jab Moon pura gol dikhta hai use kya kehte hain?", options: ["New Moon", "Full Moon (Purnima)", "Half Moon", "Crescent"], correctIndex: 1, explanation: "Purnima ke din Full Moon dikhta hai." },
      { id: "sci4-pre-6", topic: "Sun & Stars", question: "Sun kya hai?", options: ["Planet", "Star", "Satellite", "Comet"], correctIndex: 1, explanation: "Sun ek normal average size main sequence star hai." },
      { id: "sci4-pre-7", topic: "Sun & Stars", question: "Stars light aur heat energy kaise produce karte hain?", options: ["Burning wood", "Nuclear Fusion", "Electric charge", "Chemical fire"], correctIndex: 1, explanation: "Hydrogen elements fuse hokar Helium gas banate hain (Fusion)." },
      { id: "sci4-pre-8", topic: "Planets", question: "Solar system mein total kitne official planets hain?", options: ["7", "8", "9", "10"], correctIndex: 1, explanation: "Pluto reclassification ke baad 8 primary planets bache hain." },
      { id: "sci4-pre-9", topic: "Moon Phases", question: "Lunar cycle total kitne days ki hoti hai?", options: ["28 Days", "29.5 Days", "31 Days", "365 Days"], correctIndex: 1, explanation: "Approximated to 29.5 days cycle." },
      { id: "sci4-pre-10", topic: "Planets", question: "Sabse hot planet kaunsa hai?", options: ["Mercury", "Venus", "Mars", "Jupiter"], correctIndex: 1, explanation: "Venus has thick CO2 atmosphere trapping heat greenhouse style." },
    ],
    chapterEnd: [
      { id: "sci4-end-1", topic: "Planets", question: "Center star of our system?", options: ["Sun", "Sirius", "Earth", "Jupiter"], correctIndex: 0, explanation: "Sun is our solar system's star." },
      { id: "sci4-end-2", topic: "Planets", question: "Largest planet is?", options: ["Jupiter", "Saturn", "Earth", "Mars"], correctIndex: 0, explanation: "Jupiter is the biggest." },
      { id: "sci4-end-3", topic: "Moon Phases", question: "Moon's light is?", options: ["Sunlight reflection", "Own source", "Geothermal", "Star power"], correctIndex: 0, explanation: "Reflected light of the Sun." },
      { id: "sci4-end-4", topic: "Sun & Stars", question: "Process powering the Sun?", options: ["Nuclear Fusion", "Burning coal", "Fission only", "Magnetism"], correctIndex: 0, explanation: "Hydrogen fusion creates the solar energy." },
      { id: "sci4-end-5", topic: "Planets", topicLabel: "Hot Planet", question: "Hottest planet Venus has?", options: ["Greenhouse trap", "No distance", "Ice caps", "Water"], correctIndex: 0, explanation: "Venus traps heat in thick clouds." },
    ],
  },
  {
    chapterId: "ch-sci-5",
    chapterTitle: "Human Body Systems",
    prerequisite: [
      { id: "sci5-pre-1", topic: "Digestive System", question: "Digestion ki shuruaat kahan se hoti hai?", options: ["Stomach", "Mouth", "Small Intestine", "Esophagus"], correctIndex: 1, explanation: "Mouth mein saliva aur teeth se mechanical breakdowns shuru hoti hain." },
      { id: "sci5-pre-2", topic: "Digestive System", question: "Stomach mein kaunsa acid food digest karne mein help karta hai?", options: ["Sulphuric Acid", "Hydrochloric Acid (HCl)", "Nitric Acid", "Vinegar"], correctIndex: 1, explanation: "HCl acid gastric juice ka part hota hai." },
      { id: "sci5-pre-3", topic: "Digestive System", question: "Sare nutrients ka absorption main location kya hai?", options: ["Stomach", "Small Intestine", "Large Intestine", "Liver"], correctIndex: 1, explanation: "Small Intestine villi surfaces nutrients absorb karti hain." },
      { id: "sci5-pre-4", topic: "Heart & Blood", question: "Heart ka main function kya hai?", options: ["Digestion", "Blood pump karna", "Thinking", "Filtering waste"], correctIndex: 1, explanation: "Heart muscles blood circulation push karte hain." },
      { id: "sci5-pre-5", topic: "Heart & Blood", question: "Red Blood Cells (RBC) kya carry karte hain body mein?", options: ["Food", "Oxygen", "Waste products", "Sugar"], correctIndex: 1, explanation: "RBC hemoglobin ke zariye oxygen transport karte hain." },
      { id: "sci5-pre-6", topic: "Heart & Blood", question: "Human heart mein kitne chambers hote hain?", options: ["2", "3", "4", "5"], correctIndex: 2, explanation: "Human heart has 2 Atria and 2 Ventricles (total 4 chambers)." },
      { id: "sci5-pre-7", topic: "Bones & Muscles", question: "Adult human body mein total kitni bones hoti hain?", options: ["106", "206", "306", "406"], correctIndex: 1, explanation: "Adult skeleton has exactly 206 bones." },
      { id: "sci5-pre-8", topic: "Bones & Muscles", question: "Joints par bones ko connect karne wale tissue ko kya kehte hain?", options: ["Muscle", "Ligament", "Tendon", "Skin"], correctIndex: 1, explanation: "Ligament bone-to-bone tissue joints support karta hai." },
      { id: "sci5-pre-9", topic: "Bones & Muscles", question: "Skeletal muscle kis category mein aati hain?", options: ["Voluntary (In control)", "Involuntary", "Cardiac", "None"], correctIndex: 0, explanation: "We control skeletal muscles at will." },
      { id: "sci5-pre-10", topic: "Digestive System", question: "Large Intestine ka main function kya hai?", options: ["Nutrient absorb", "Water absorption", "Acid production", "Bile storage"], correctIndex: 1, explanation: "Large Intestine leftover waste se water absorb karti hai." },
    ],
    chapterEnd: [
      { id: "sci5-end-1", topic: "Digestive System", question: "Digestion initiates in?", options: ["Mouth", "Stomach", "Intestine", "Throat"], correctIndex: 0, explanation: "Teeth and saliva start it in mouth." },
      { id: "sci5-end-2", topic: "Heart & Blood", question: "Blood pump station is?", options: ["Heart", "Lungs", "Brain", "Kidneys"], correctIndex: 0, explanation: "Heart pumps the blood." },
      { id: "sci5-end-3", topic: "Bones & Muscles", question: "Adult skeleton bones count?", options: ["206", "100", "300", "250"], correctIndex: 0, explanation: "It has 206 bones." },
      { id: "sci5-end-4", topic: "Digestive System", question: "Small Intestine absorbs?", options: ["Nutrients", "Water only", "Acids", "Saliva"], correctIndex: 0, explanation: "Villi absorb primary nutrients." },
      { id: "sci5-end-5", topic: "Heart & Blood", question: "RBC carries?", options: ["Oxygen", "Carbon only", "Fat", "Acid"], correctIndex: 0, explanation: "RBC transports Oxygen." },
    ],
  },

  // ─── ENGLISH (5 Chapters) ──────────────────────────────────────────────────

  {
    chapterId: "ch-eng-1",
    chapterTitle: "Parts of Speech",
    prerequisite: [
      { id: "eng1-pre-1", topic: "Nouns", question: "Identify the noun: 'The dog barked at the mailman.'", options: ["dog", "barked", "at", "loudly"], correctIndex: 0, explanation: "Nouns represent people, places, or things. Dog is a noun." },
      { id: "eng1-pre-2", topic: "Nouns", question: "Which word is a plural noun?", options: ["child", "children", "child's", "childhood"], correctIndex: 1, explanation: "'Children' is the irregular plural form of child." },
      { id: "eng1-pre-3", topic: "Pronouns", question: "Replace the name: 'Sarah went shopping.'", options: ["He", "She", "It", "They"], correctIndex: 1, explanation: "'She' is the feminine subject pronoun." },
      { id: "eng1-pre-4", topic: "Pronouns", question: "Find the pronoun: 'Give it to them.'", options: ["Give", "it", "to", "them"], correctIndex: 3, explanation: "'Them' is the objective plural pronoun." },
      { id: "eng1-pre-5", topic: "Adjectives", question: "Find the adjective: 'She wore a pretty blue dress.'", options: ["wore", "pretty", "dress", "she"], correctIndex: 1, explanation: "'Pretty' modifies/describes the dress." },
      { id: "eng1-pre-6", topic: "Adjectives", question: "Adjectives describe which of the following?", options: ["Verbs", "Nouns", "Conjunctions", "Prepositions"], correctIndex: 1, explanation: "Adjectives describe nouns and pronouns." },
      { id: "eng1-pre-7", topic: "Verbs", question: "Find the action verb: 'The cat slept peacefully.'", options: ["cat", "slept", "peacefully", "the"], correctIndex: 1, explanation: "'Slept' represents the physical state/action." },
      { id: "eng1-pre-8", topic: "Verbs", question: "Find the auxiliary (helping) verb: 'We are studying.'", options: ["are", "studying", "we", "studying are"], correctIndex: 0, explanation: "'Are' helps the main action studying." },
      { id: "eng1-pre-9", topic: "Pronouns", question: "Possessive pronoun example?", options: ["mine", "me", "I", "myself"], correctIndex: 0, explanation: "'Mine' shows ownership." },
      { id: "eng1-pre-10", topic: "Nouns", question: "Identify the proper noun:", options: ["city", "country", "India", "state"], correctIndex: 2, explanation: "Proper nouns name specific items, capitalized." },
    ],
    chapterEnd: [
      { id: "eng1-end-1", topic: "Nouns", question: "Which is a common noun?", options: ["Boy", "Tom", "London", "March"], correctIndex: 0, explanation: "Boy is general (common)." },
      { id: "eng1-end-2", topic: "Pronouns", question: "Pronoun replacing plural group?", options: ["They", "He", "Him", "It"], correctIndex: 0, explanation: "'They' matches groups." },
      { id: "eng1-end-3", topic: "Adjectives", question: "Adjective in 'Fast car'?", options: ["Fast", "Car", "Is", "A"], correctIndex: 0, explanation: "'Fast' describes the car." },
      { id: "eng1-end-4", topic: "Verbs", question: "Action verb in 'She runs'?", options: ["runs", "she", "fast", "is"], correctIndex: 0, explanation: "runs is action." },
      { id: "eng1-end-5", topic: "Adjectives", question: "Which describes a noun?", options: ["Adjective", "Adverb", "Verb", "Preposition"], correctIndex: 0, explanation: "Adjectives modify nouns." },
    ],
  },
  {
    chapterId: "ch-eng-2",
    chapterTitle: "Verbs & Tenses",
    prerequisite: [
      { id: "eng2-pre-1", topic: "Present Tense", question: "She ____ to school every day.", options: ["go", "goes", "going", "gone"], correctIndex: 1, explanation: "Third-person singular takes 'goes' in simple present." },
      { id: "eng2-pre-2", topic: "Present Tense", question: "Identify the simple present sentence:", options: ["I read books.", "I am reading books.", "I read a book yesterday.", "I will read books."], correctIndex: 0, explanation: "'I read books' is general present habit." },
      { id: "eng2-pre-3", topic: "Past Tense", question: "Past tense of 'go' is?", options: ["goes", "going", "went", "gone"], correctIndex: 2, explanation: "'Go' is irregular, past is 'went'." },
      { id: "eng2-pre-4", topic: "Past Tense", question: "Past tense of 'study' is?", options: ["studys", "studies", "studied", "studying"], correctIndex: 2, explanation: "Y changes to i + ed: studied." },
      { id: "eng2-pre-5", topic: "Future Tense", question: "We ____ play tomorrow.", options: ["will", "have", "are", "did"], correctIndex: 0, explanation: "Future auxiliary is 'will'." },
      { id: "eng2-pre-6", topic: "Future Tense", question: "Which is a future prediction?", options: ["It rains.", "It is raining.", "It will rain.", "It rained."], correctIndex: 2, explanation: "'Will rain' indicates future." },
      { id: "eng2-pre-7", topic: "Present Tense", question: "Continuous present helper for 'They'?", options: ["is", "am", "are", "was"], correctIndex: 2, explanation: "They takes plural 'are' (They are studying)." },
      { id: "eng2-pre-8", topic: "Past Tense", question: "Irregular past tense example?", options: ["played", "cooked", "wrote", "walked"], correctIndex: 2, explanation: "'Write' changes to 'wrote', not 'writed'." },
      { id: "eng2-pre-9", topic: "Future Tense", question: "Continuous future form?", options: ["will be running", "ran", "runs", "is running"], correctIndex: 0, explanation: "'Will be + verb-ing' is continuous future." },
      { id: "eng2-pre-10", topic: "Past Tense", question: "Negative past statement indicator?", options: ["did not", "does not", "will not", "is not"], correctIndex: 0, explanation: "'Did not' is used for past negative." },
    ],
    chapterEnd: [
      { id: "eng2-end-1", topic: "Present Tense", question: "He ____ books.", options: ["reads", "read", "reading", "will read"], correctIndex: 0, explanation: "Reads is simple present third person." },
      { id: "eng2-end-2", topic: "Past Tense", question: "Past of 'buy'?", options: ["bought", "buyed", "buying", "buys"], correctIndex: 0, explanation: "Irregular past of buy is bought." },
      { id: "eng2-end-3", topic: "Future Tense", question: "Future action indicator?", options: ["will jump", "jumped", "jumps", "jumping"], correctIndex: 0, explanation: "'Will jump' is future." },
      { id: "eng2-end-4", topic: "Past Tense", question: "Studied is a?", options: ["Past verb", "Present verb", "Adjective", "Noun"], correctIndex: 0, explanation: "Studied is past tense." },
      { id: "eng2-end-5", topic: "Present Tense", question: "Plural present of walk?", options: ["walk", "walks", "walked", "walking"], correctIndex: 0, explanation: "Plural pronoun 'We' takes 'walk'." },
    ],
  },
  {
    chapterId: "ch-eng-3",
    chapterTitle: "Sentence Structure",
    prerequisite: [
      { id: "eng3-pre-1", topic: "Subject", question: "Find the subject: 'The little cat chased the mouse.'", options: ["cat chased", "The little cat", "the mouse", "chased"], correctIndex: 1, explanation: "Subject is who performs the action: 'The little cat'." },
      { id: "eng3-pre-2", topic: "Subject", question: "What is a subject?", options: ["Action", "Who/what is acting", "Details", "Connectors"], correctIndex: 1, explanation: "Subject tells who or what the sentence is about." },
      { id: "eng3-pre-3", topic: "Predicate", question: "Find the predicate: 'The children played in the park.'", options: ["The children", "played in the park", "in the park", "played"], correctIndex: 1, explanation: "Predicate states the action and detail: 'played in the park'." },
      { id: "eng3-pre-4", topic: "Predicate", question: "Predicate always contains a?", options: ["Noun", "Verb", "Adjective", "Comma"], correctIndex: 1, explanation: "A predicate must contain a verb." },
      { id: "eng3-pre-5", topic: "Punctuation", question: "Which sentence ends correctly?", options: ["Where are you going.", "Where are you going?", "Where are you going,", "Where are you going!"], correctIndex: 1, explanation: "Questions end with a question mark." },
      { id: "eng3-pre-6", topic: "Punctuation", question: "Exclamatory end mark?", options: ["Period", "Question mark", "Exclamation mark", "Comma"], correctIndex: 2, explanation: "Excitement uses exclamation marks." },
      { id: "eng3-pre-7", topic: "Subject", question: "Compound subject example?", options: ["Ram and Shyam went", "She ran", "Dog barks", "They study"], correctIndex: 0, explanation: "'Ram and Shyam' are two subjects linked." },
      { id: "eng3-pre-8", topic: "Predicate", question: "Predicate in 'Dogs bark'?", options: ["Dogs", "bark", "None", "Bark dogs"], correctIndex: 1, explanation: "'bark' is the verb/action phrase." },
      { id: "eng3-pre-9", topic: "Punctuation", question: "Declarative sentences end with?", options: ["Period", "Question mark", "Exclamation", "Colon"], correctIndex: 0, explanation: "Normal statements end with a period." },
      { id: "eng3-pre-10", topic: "Subject", question: "Subject of 'Under the tree lay the dog.'?", options: ["tree", "dog", "lay", "under"], correctIndex: 1, explanation: "The dog is doing the action (lying), despite word order." },
    ],
    chapterEnd: [
      { id: "eng3-end-1", topic: "Subject", question: "Subject of 'Sam sings'?", options: ["Sam", "sings", "sings Sam", "None"], correctIndex: 0, explanation: "Sam is subject." },
      { id: "eng3-end-2", topic: "Predicate", question: "Predicate in 'Sam sings'?", options: ["sings", "Sam", "sings Sam", "None"], correctIndex: 0, explanation: "'sings' is predicate." },
      { id: "eng3-end-3", topic: "Punctuation", question: "Question mark is for?", options: ["Questions", "Statements", "Excitement", "Pauses"], correctIndex: 0, explanation: "Used at end of interrogative sentences." },
      { id: "eng3-end-4", topic: "Subject", question: "Identify subject: 'Rain fell.'", options: ["Rain", "fell", "None", "Rain fell"], correctIndex: 0, explanation: "Rain is subject." },
      { id: "eng3-end-5", topic: "Predicate", question: "Identify verb-led predicate: 'The baby cried loudly.'", options: ["cried loudly", "The baby", "baby", "cried"], correctIndex: 0, explanation: "Verb + adverb modifier forms predicate." },
    ],
  },
  {
    chapterId: "ch-eng-4",
    chapterTitle: "Punctuation Rules",
    prerequisite: [
      { id: "eng4-pre-1", topic: "Commas", question: "Where does the comma go? 'I bought apples bananas and oranges.'", options: ["apples, bananas, and", "apples bananas, and", "apples, bananas and,", "No comma"], correctIndex: 0, explanation: "Lists use commas to separate items." },
      { id: "eng4-pre-2", topic: "Commas", question: "Commas are used to indicate what in reading?", options: ["Full stop", "Slight pause", "End of book", "Excitement"], correctIndex: 1, explanation: "Commas mark short breath pauses." },
      { id: "eng4-pre-3", topic: "Apostrophes", question: "Which shows ownership? 'The dogs collar.'", options: ["dog's", "dogs'", "dogs", "doges"], correctIndex: 0, explanation: "Singular possessive uses 's (dog's)." },
      { id: "eng4-pre-4", topic: "Apostrophes", question: "Contraction of 'do not' is?", options: ["don't", "dont", "do'nt", "d'ont"], correctIndex: 0, explanation: "Contraction places apostrophe at omitted letter place (don't)." },
      { id: "eng4-pre-5", topic: "Capitalization", question: "Which should be capitalized?", options: ["monday", "morning", "month", "market"], correctIndex: 0, explanation: "Days of the week are proper nouns." },
      { id: "eng4-pre-6", topic: "Capitalization", question: "First letter of a sentence must be?", options: ["Lowercase", "Capital (Uppercase)", "Italic", "Bold"], correctIndex: 1, explanation: "Standard grammar rule." },
      { id: "eng4-pre-7", topic: "Apostrophes", question: "Plural ownership of 'dogs'?", options: ["dogs'", "dog's", "dogs", "dogses"], correctIndex: 0, explanation: "Plural ending in s takes apostrophe after s: dogs'." },
      { id: "eng4-pre-8", topic: "Commas", question: "Address separator?", options: ["Comma", "Period", "Colon", "Semicolon"], correctIndex: 0, explanation: "Commas separate street and city names." },
      { id: "eng4-pre-9", topic: "Capitalization", question: "Which is capital correct?", options: ["i live in India.", "I live in india.", "I live in India.", "i live in india."], correctIndex: 2, explanation: "Capitalize pronoun 'I' and proper noun 'India'." },
      { id: "eng4-pre-10", topic: "Commas", question: "Introductory phrase connector?", options: ["Comma", "Hyphen", "Period", "Dash"], correctIndex: 0, explanation: "Intro clauses take commas (e.g. 'Yes, I will.')" },
    ],
    chapterEnd: [
      { id: "eng4-end-1", topic: "Commas", question: "List separator?", options: ["Comma", "Slash", "Colon", "Dash"], correctIndex: 0, explanation: "Commas link list items." },
      { id: "eng4-end-2", topic: "Apostrophes", question: "Contraction of 'cannot'?", options: ["can't", "cant", "ca'nt", "cann't"], correctIndex: 0, explanation: "Omitted letters replaced by apostrophe: can't." },
      { id: "eng4-end-3", topic: "Capitalization", question: "Capital correct day name?", options: ["Sunday", "sunday", "sUnDaY", "Sund-ay"], correctIndex: 0, explanation: "Sunday is proper noun." },
      { id: "eng4-end-4", topic: "Apostrophes", question: "Possessive form of boy?", options: ["boy's", "boys", "boys'", "boyes"], correctIndex: 0, explanation: "Singular possessive is boy's." },
      { id: "eng4-end-5", topic: "Commas", question: "Pause indicator?", options: ["Comma", "Period", "Exclamation", "Question"], correctIndex: 0, explanation: "Short pause uses comma." },
    ],
  },
  {
    chapterId: "ch-eng-5",
    chapterTitle: "Synonyms & Antonyms",
    prerequisite: [
      { id: "eng5-pre-1", topic: "Similar Meanings", question: "Synonym of 'Happy' is?", options: ["Sad", "Glad", "Angry", "Tired"], correctIndex: 1, explanation: "Glad means happy (synonyms)." },
      { id: "eng5-pre-2", topic: "Similar Meanings", question: "Synonym of 'Huge' is?", options: ["Tiny", "Large", "Heavy", "Small"], correctIndex: 1, explanation: "Large is similar to huge." },
      { id: "eng5-pre-3", topic: "Opposite Meanings", question: "Antonym of 'Cold' is?", options: ["Freezing", "Hot", "Cool", "Ice"], correctIndex: 1, explanation: "Hot is the opposite of cold (antonyms)." },
      { id: "eng5-pre-4", topic: "Opposite Meanings", question: "Antonym of 'Fast' is?", options: ["Quick", "Slow", "Rapid", "Speedy"], correctIndex: 1, explanation: "Slow is opposite of fast." },
      { id: "eng5-pre-5", topic: "Context Clues", question: "Word meaning clue from surrounding words?", options: ["Context Clue", "Dictionary", "Spelling", "Grammar"], correctIndex: 0, explanation: "Surrounding sentence context explains unfamiliar words." },
      { id: "eng5-pre-6", topic: "Similar Meanings", question: "Synonym of 'Quick'?", options: ["Slow", "Fast", "Quiet", "Noisy"], correctIndex: 1, explanation: "Fast is similar to quick." },
      { id: "eng5-pre-7", topic: "Opposite Meanings", question: "Antonym of 'Difficult'?", options: ["Hard", "Easy", "Tough", "Simple"], correctIndex: 1, explanation: "Easy is opposite of difficult." },
      { id: "eng5-pre-8", topic: "Similar Meanings", question: "Synonym of 'Smart'?", options: ["Clever", "Dull", "Quiet", "Silly"], correctIndex: 0, explanation: "Clever is smart." },
      { id: "eng5-pre-9", topic: "Opposite Meanings", question: "Antonym of 'Quiet'?", options: ["Silent", "Noisy", "Calm", "Peaceful"], correctIndex: 1, explanation: "Noisy is opposite of quiet." },
      { id: "eng5-pre-10", topic: "Context Clues", question: "Unfamiliar word guesser?", options: ["Guess by context", "Skip it", "Delete it", "Ignore"], correctIndex: 0, explanation: "Reading context clues helps guess the definition." },
    ],
    chapterEnd: [
      { id: "eng5-end-1", topic: "Similar Meanings", question: "Synonym of 'Begin'?", options: ["Start", "End", "Stop", "Pause"], correctIndex: 0, explanation: "Start is beginning." },
      { id: "eng5-end-2", topic: "Opposite Meanings", question: "Antonym of 'Strong'?", options: ["Weak", "Tough", "Heavy", "Tall"], correctIndex: 0, explanation: "Weak is opposite of strong." },
      { id: "eng5-end-3", topic: "Similar Meanings", question: "Synonym of 'Tiny'?", options: ["Small", "Big", "Loud", "Fast"], correctIndex: 0, explanation: "Small is tiny." },
      { id: "eng5-end-4", topic: "Opposite Meanings", question: "Antonym of 'Dark'?", options: ["Light", "Black", "Cold", "Dim"], correctIndex: 0, explanation: "Light is opposite of dark." },
      { id: "eng5-end-5", topic: "Similar Meanings", question: "Synonym of 'Beautiful'?", options: ["Pretty", "Ugly", "Sad", "Smart"], correctIndex: 0, explanation: "Pretty is beautiful." },
    ],
  },

  // ─── SOCIAL SCIENCE (5 Chapters) ──────────────────────────────────────────

  {
    chapterId: "ch-hist-1",
    chapterTitle: "Jallianwala Bagh Massacre",
    prerequisite: [
      { id: "hist1-pre-1", topic: "Location & Context", question: "Jallianwala Bagh kahan sthit hai?", options: ["Delhi", "Amritsar", "Lahore", "Mumbai"], correctIndex: 1, explanation: "Jallianwala Bagh Amritsar, Punjab mein Golden Temple ke paas sthit hai." },
      { id: "hist1-pre-2", topic: "Location & Context", question: "Kaunsa saal Jallianwala Bagh haadsa hua?", options: ["1905", "1915", "1919", "1942"], correctIndex: 2, explanation: "13 April 1919 ko Baisakhi festival day ke din hua." },
      { id: "hist1-pre-3", topic: "Rowlatt Act", question: "Rowlatt Act kya tha?", options: ["Tax law", "Bina trial arrest authority", "Trade act", "Independence pact"], correctIndex: 1, explanation: "Colonial law enabling arrest without trial." },
      { id: "hist1-pre-4", topic: "Rowlatt Act", question: "Rowlatt Act kab pass hua?", options: ["1905", "1915", "1919", "1930"], correctIndex: 2, explanation: "Passed in March 1919." },
      { id: "hist1-pre-5", topic: "General Dyer", question: "General Dyer ne firing command kyun diya?", options: ["Crowd violent thi", "Public meeting assembly ban tha", "Military exercise", "Accident"], correctIndex: 1, explanation: "Dyer targeted the assembly to enforce the public gathering ban." },
      { id: "hist1-pre-6", topic: "General Dyer", question: "General Dyer kis post par tha?", options: ["Soldier", "Brigadier-General", "Freedom fighter", "Civil Magistrate"], correctIndex: 1, explanation: "Dyer was British Brigadier-General." },
      { id: "hist1-pre-7", topic: "Impact", question: "Rabindranath Tagore returned what in protest?", options: ["Money", "Knighthood title", "Land", "Books"], correctIndex: 1, explanation: "Returned his Knighthood title in protest." },
      { id: "hist1-pre-8", topic: "Impact", question: "Massacre boosted which movement?", options: ["Satyagraha only", "Non-Cooperation Movement", "Quit India", "Civil Disobedience"], correctIndex: 1, explanation: "Gave massive strength to Gandhi's Non-Cooperation Movement." },
      { id: "hist1-pre-9", topic: "Investigation", question: "Which commission investigated the incident?", options: ["Simon Commission", "Hunter Commission", "Radcliffe", "Kothari"], correctIndex: 1, explanation: "Hunter Commission was set up." },
      { id: "hist1-pre-10", topic: "Investigation", topicLabel: "Retaliation", question: "Who assassinated Michael O'Dwyer in 1940?", options: ["Udham Singh", "Bhagat Singh", "Rajguru", "Sukhdev"], correctIndex: 0, explanation: "Udham Singh took revenge in London." },
    ],
    chapterEnd: [
      { id: "hist1-end-1", topic: "General Dyer", question: "Commanding officer of the massacre?", options: ["Dyer", "O'Dwyer", "Mountbatten", "Ripon"], correctIndex: 0, explanation: "General Dyer ordered the firing." },
      { id: "hist1-end-2", topic: "Investigation", question: "Udham Singh assassinated O'Dwyer in?", options: ["1940", "1919", "1930", "1947"], correctIndex: 0, explanation: "Killed Michael O'Dwyer in London, 1940." },
      { id: "hist1-end-3", topic: "Investigation", question: "Investigation group name?", options: ["Hunter Commission", "Simon Commission", "Rowlatt Committee", "Cabinet Mission"], correctIndex: 0, explanation: "Hunter Commission." },
      { id: "hist1-end-4", topic: "Impact", question: "Returned Knighthood belongs to?", options: ["Tagore", "Gandhi", "Nehru", "Patel"], correctIndex: 0, explanation: "Rabindranath Tagore returned it." },
      { id: "hist1-end-5", topic: "Impact", question: "Massacre turning point led to?", options: ["Non-Cooperation", "Partition", "Peace treaty", "Acceptance"], correctIndex: 0, explanation: "Unleashed Non-Cooperation Movement." },
    ],
  },
  {
    chapterId: "ch-hist-2",
    chapterTitle: "The Revolt of 1857",
    prerequisite: [
      { id: "hist2-pre-1", topic: "Causes", question: "1857 Revolt ka immediate trigger cause kya tha?", options: ["New land taxes", "Greased cartridges (beef/pork fat)", "Doctrine of Lapse", "Language barrier"], correctIndex: 1, explanation: "Enfield rifle cartridges greased with pig/cow fat hurt religious sentiments." },
      { id: "hist2-pre-2", topic: "Causes", question: "East India Company ke rules se koun sabse zyada dukhi the?", options: ["Peasants and Sepoys", "British merchants", "Royal families only", "None"], correctIndex: 0, explanation: "Sepoys and peasants faced extreme exploitation." },
      { id: "hist2-pre-3", topic: "Key Leaders", question: "Barrackpore mein kis sepoy ne revolt start kiya?", options: ["Mangal Pandey", "Tatya Tope", "Nana Sahib", "Kunwar Singh"], correctIndex: 0, explanation: "Mangal Pandey fired at British officers in March 1857." },
      { id: "hist2-pre-4", topic: "Key Leaders", question: "Jhansi se kisne lead kiya?", options: ["Rani Lakshmibai", "Begum Hazrat Mahal", "Kasturba", "Sarojini Naidu"], correctIndex: 0, explanation: "Rani Lakshmibai fought valiantly for Jhansi." },
      { id: "hist2-pre-5", topic: "Key Leaders", question: "Revolters ne kis mugal ruler ko leader declare kiya?", options: ["Akbar II", "Bahadur Shah Zafar", "Aurangzeb", "Shah Alam"], correctIndex: 1, explanation: "Old emperor Bahadur Shah Zafar was proclaimed leader." },
      { id: "hist2-pre-6", topic: "Outcomes", question: "Revolt fail hone ka main reason kya tha?", options: ["No common plan and leadership", "Lack of weapons", "No support from public", "British left India"], correctIndex: 0, explanation: "Revolt lacked central coordination and localized support." },
      { id: "hist2-pre-7", topic: "Outcomes", question: "Revolt ke baad kis company ka rule khatam hua?", options: ["Dutch Company", "East India Company", "French Company", "British Crown directly"], correctIndex: 1, explanation: "Rule was transferred from East India Company directly to the British Crown." },
      { id: "hist2-pre-8", topic: "Causes", question: "Doctrine of Lapse policy kisne start ki thi?", options: ["Lord Dalhousie", "Lord Canning", "Lord Wellesley", "Lord Curzon"], correctIndex: 0, explanation: "Dalhousie took kingdoms without natural heirs." },
      { id: "hist2-pre-9", topic: "Key Leaders", question: "Nana Sahib kahan se lead kar rahe the?", options: ["Kanpur", "Delhi", "Jhansi", "Lucknow"], correctIndex: 0, explanation: "Nana Sahib led the uprising in Kanpur." },
      { id: "hist2-pre-10", topic: "Outcomes", question: "1857 revolt ko kya kaha jata hai?", options: ["Sepoy Mutiny / First War of Independence", "Quit India", "Satyagraha", "Civil War"], correctIndex: 0, explanation: "Popularly known as Sepoy Mutiny or First War of Independence." },
    ],
    chapterEnd: [
      { id: "hist2-end-1", topic: "Causes", question: "Trigger cause cartridge grease?", options: ["Beef and pork fat", "Oil", "Chemicals", "Wax"], correctIndex: 0, explanation: "Pig and cow fat triggered religious outrage." },
      { id: "hist2-end-2", topic: "Key Leaders", question: "Fighter sepoy at Barrackpore?", options: ["Mangal Pandey", "Nana Sahib", "Tatya Tope", "Kunwar Singh"], correctIndex: 0, explanation: "Mangal Pandey was the pioneer." },
      { id: "hist2-end-3", topic: "Key Leaders", question: "Jhansi ruler leader?", options: ["Rani Lakshmibai", "Begum Hazrat", "Zafar", "Kunwar"], correctIndex: 0, explanation: "Rani Lakshmibai led Jhansi." },
      { id: "hist2-end-4", topic: "Outcomes", question: "EIC rule shifted to?", options: ["British Crown", "French rule", "Mughal Empire", "Indian Parliament"], correctIndex: 0, explanation: "Power transferred directly to the Crown (Queen Victoria)." },
      { id: "hist2-end-5", topic: "Outcomes", question: "Revolt lack of success due to?", options: ["Lack of unity/coordination", "No weapons", "British numbers", "Climate"], correctIndex: 0, explanation: "Lacked centralized planning and synchronization." },
    ],
  },
  {
    chapterId: "ch-hist-3",
    chapterTitle: "The Indian Constitution",
    prerequisite: [
      { id: "hist3-pre-1", topic: "Drafting", question: "Drafting Committee ke chairman kaun the?", options: ["B. R. Ambedkar", "Jawaharlal Nehru", "Mahatma Gandhi", "Rajendra Prasad"], correctIndex: 0, explanation: "Dr. B.R. Ambedkar was chairman of Drafting Committee." },
      { id: "hist3-pre-2", topic: "Drafting", question: "Indian Constitution kab fully adopt hua?", options: ["26 Jan 1950", "15 Aug 1947", "26 Nov 1949", "30 Jan 1948"], correctIndex: 2, explanation: "Adopted on 26 Nov 1949, came into force on 26 Jan 1950." },
      { id: "hist3-pre-3", topic: "Preamble", question: "Preamble kya hai?", options: ["Sovereign declaration index", "Introduction/Preface to Constitution", "List of amendments", "Court rules"], correctIndex: 1, explanation: "Preamble serves as the introductory preface." },
      { id: "hist3-pre-4", topic: "Preamble", question: "Sovereign state ka kya matlab hai?", options: ["Free from external control", "Ruled by King", "Dependent state", "Federal control"], correctIndex: 0, explanation: "Sovereign means independent authority." },
      { id: "hist3-pre-5", topic: "Fundamental Rights", question: "Right to Equality kis scope mein hai?", options: ["Fundamental Rights", "Directive Principles", "Duties", "Preamble"], correctIndex: 0, explanation: "It is a fundamental right (Articles 14-18)." },
      { id: "hist3-pre-6", topic: "Fundamental Rights", question: "Total kitne Fundamental Rights standard text mein hain?", options: ["6", "7", "8", "9"], correctIndex: 0, explanation: "Constitutions lists 6 basic Fundamental Rights currently (Right to Property removed)." },
      { id: "hist3-pre-7", topic: "Drafting", question: "Constituent Assembly president?", options: ["Rajendra Prasad", "Ambedkar", "Nehru", "Radhakrishnan"], correctIndex: 0, explanation: "Dr. Raj राजेंद्र Prasad was President of the Assembly." },
      { id: "hist3-pre-8", topic: "Fundamental Rights", question: "Constitution ka heart and soul kis right ko kehte hain?", options: ["Constitutional Remedies", "Equality", "Freedom", "Religion"], correctIndex: 0, explanation: "Dr. Ambedkar called Article 32 (Constitutional Remedies) the heart and soul." },
      { id: "hist3-pre-9", topic: "Preamble", question: "Secular term ka kya meaning hai?", options: ["No state religion, equal respect to all", "One major religion", "No religious freedom", "Monarchy rule"], correctIndex: 0, explanation: "Secular ensures neutral treatment of all faiths." },
      { id: "hist3-pre-10", topic: "Drafting", question: "Republic Day kis context mein celebrate hota hai?", options: ["Constitution came into force", "Independence Day", "Gandhi Birthday", "War win"], correctIndex: 0, explanation: "26 Jan 1950 marks Constitution implementation day." },
    ],
    chapterEnd: [
      { id: "hist3-end-1", topic: "Drafting", question: "Chairman of Drafting Committee?", options: ["Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Rajendra Prasad", "Patel"], correctIndex: 0, explanation: "Dr. Ambedkar headed it." },
      { id: "hist3-end-2", topic: "Preamble", question: "Preamble represents?", options: ["Preface/Introduction", "Entire penal code", "Tax structures", "Map of states"], correctIndex: 0, explanation: "Introduction outlines basic philosophy." },
      { id: "hist3-end-3", topic: "Fundamental Rights", question: "Right to Equality is a?", options: ["Fundamental Right", "Directive duty", "State choice", "Monal law"], correctIndex: 0, explanation: "It is guaranteed in Part III." },
      { id: "hist3-end-4", topic: "Drafting", question: "Constitution implementation date?", options: ["26 Jan 1950", "15 Aug 1947", "26 Nov 1949", "1 Jan 1950"], correctIndex: 0, explanation: "Implemented on Republic Day (26 Jan 1950)." },
      { id: "hist3-end-5", topic: "Fundamental Rights", question: "How many basic fundamental rights are there?", options: ["6", "7", "5", "8"], correctIndex: 0, explanation: "6 basic rights remain." },
    ],
  },
  {
    chapterId: "ch-hist-4",
    chapterTitle: "The French Revolution",
    prerequisite: [
      { id: "hist4-pre-1", topic: "Three Estates", question: "French society kitne estates mein divided thi?", options: ["2", "3", "4", "5"], correctIndex: 1, explanation: "Divided into First (Clergy), Second (Nobility), and Third (Commoners) Estates." },
      { id: "hist4-pre-2", topic: "Three Estates", question: "Sare taxes pay karne ki duty kis estate ki thi?", options: ["Third Estate", "First Estate", "Second Estate", "Clergy only"], correctIndex: 0, explanation: "Third estate commoners paid all the taxes." },
      { id: "hist4-pre-3", topic: "Bastille", question: "Bastille fort prison kab storm kiya gaya?", options: ["14 July 1789", "15 Aug 1789", "21 Jan 1793", "20 June 1789"], correctIndex: 0, explanation: "Storming of Bastille took place on 14 July 1789." },
      { id: "hist4-pre-4", topic: "Bastille", question: "Bastille kya represent karta chal raha tha?", options: ["Royal family love", "Despotic power of the king", "Military power", "Liberty"], correctIndex: 1, explanation: "Bastille was hated symbol of king's autocratic tyranny." },
      { id: "hist4-pre-5", topic: "Three Estates", question: "King Louis XVI kis dynasty se belong karta tha?", options: ["Bourbon", "Habsburg", "Tudor", "Romanov"], correctIndex: 0, explanation: "Autocratic Bourbon family." },
      { id: "hist4-pre-6", topic: "Napoleon", question: "French Revolution ka main slogan kya tha?", options: ["Liberty, Equality, Fraternity", "Peace, Bread, Land", "Do or Die", "Live and let live"], correctIndex: 0, explanation: "Liberté, égalité, fraternité." },
      { id: "hist4-pre-7", topic: "Napoleon", question: "Napoleon Bonaparte France ka Emperor kab bana?", options: ["1804", "1799", "1815", "1789"], correctIndex: 0, explanation: "Crowned himself Emperor of France in 1804." },
      { id: "hist4-pre-8", topic: "Three Estates", question: "Tithe tax kisko pay kiya jata tha?", options: ["Church (Clergy)", "King directly", "Landlords", "Nobility"], correctIndex: 0, explanation: "Tithe was a religious tax paid to the Church." },
      { id: "hist4-pre-9", topic: "Bastille", question: "French assembly legislative name during revolution?", options: ["National Assembly", "Duma", "Congress", "Parliament"], correctIndex: 0, explanation: "Commoners declared themselves National Assembly." },
      { id: "hist4-pre-10", topic: "Napoleon", question: "Waterloo battle mein Napoleon kab hara?", options: ["1815", "1804", "1812", "1821"], correctIndex: 0, explanation: "Defeated at Waterloo in 1815." },
    ],
    chapterEnd: [
      { id: "hist4-end-1", topic: "Three Estates", question: "Tax burdened class in France?", options: ["Third Estate", "Clergy", "Nobles", "First Estate"], correctIndex: 0, explanation: "Autocrats exempted clergy and nobility." },
      { id: "hist4-end-2", topic: "Bastille", question: "Storming date of Bastille?", options: ["14 July 1789", "20 June 1789", "1 Jan 1789", "10 Aug 1792"], correctIndex: 0, explanation: "14 July is national day." },
      { id: "hist4-end-3", topic: "Napoleon", question: "Emperor coronation year?", options: ["1804", "1799", "1815", "1812"], correctIndex: 0, explanation: "1804 was coronation." },
      { id: "hist4-end-4", topic: "Three Estates", question: "Bourbon king name?", options: ["Louis XVI", "Louis XIV", "Henry IV", "Napoleon"], correctIndex: 0, explanation: "Louis XVI ruled then." },
      { id: "hist4-end-5", topic: "Napoleon", question: "Defeat battle Waterloo?", options: ["1815", "1804", "1799", "1821"], correctIndex: 0, explanation: "Napoleon fell in 1815." },
    ],
  },
  {
    chapterId: "ch-hist-5",
    chapterTitle: "The Industrial Revolution",
    prerequisite: [
      { id: "hist5-pre-1", topic: "Steam Engine", question: "Industrial Revolution ki shuruaat kis country se hui?", options: ["Germany", "France", "Great Britain", "USA"], correctIndex: 2, explanation: "Started in Great Britain due to coal, resources, and colonies." },
      { id: "hist5-pre-2", topic: "Steam Engine", question: "Steam Engine ka improved model kisne design kiya?", options: ["James Watt", "Thomas Newcomen", "George Stephenson", "Robert Fulton"], correctIndex: 0, explanation: "James Watt modified Newcomen's engine in 1776." },
      { id: "hist5-pre-3", topic: "Factories", question: "Industrialisation se pehle products kaise bante the?", options: ["Factories mein", "Handmade (Cottage Industry)", "Import patterns", "Machines"], correctIndex: 1, explanation: "People worked at home manually (Cottage system)." },
      { id: "hist5-pre-4", topic: "Factories", question: "Spinning Jenny kis industry mein use hoti thi?", options: ["Coal mining", "Textiles (Kapda)", "Metal casting", "Agriculture"], correctIndex: 1, explanation: "Weaving and spinning thread speed up." },
      { id: "hist5-pre-5", topic: "Urban Growth", question: "Rural population ka cities ki taraf move hona kya kehlata hai?", options: ["Migration", "Urbanisation", "Colonisation", "Suburbanisation"], correctIndex: 1, explanation: "Shifting to cities for factory work." },
      { id: "hist5-pre-6", topic: "Urban Growth", question: "Industrial cities mein workers ki life status kaisi thi?", options: ["Excellent housing", "Crowded and unhygienic slums", "Very rich lifestyle", "Free food"], correctIndex: 1, explanation: "Slums, long hours, and poor sanitary conditions." },
      { id: "hist5-pre-7", topic: "Steam Engine", question: "Locomotive steam engine Train kisne start kiya?", options: ["Stephenson", "Watt", "Newcomen", "Tesla"], correctIndex: 0, explanation: "George Stephenson built the first public railway locomotive line." },
      { id: "hist5-pre-8", topic: "Factories", question: "Child labour laws pass hone se pehle children?", options: ["Only studied", "Worked long hours in dangerous mines/factories", "Played sports", "Got huge salaries"], correctIndex: 1, explanation: "Children faced extreme exploitation in chimney sweeps and mines." },
      { id: "hist5-pre-9", topic: "Urban Growth", question: "Capitalism system promote hone ka main dynamic?", options: ["Private ownership of factories for profit", "State control", "Royal handovers", "Barter trade"], correctIndex: 0, explanation: "Owners ran private operations to maximize profit." },
      { id: "hist5-pre-10", topic: "Factories", question: "Mass production ka kya impact pada goods pricing par?", options: ["Sasti ho gayi (Prices dropped)", "Mehengi ho gayi", "No change", "Unavailable"], correctIndex: 0, explanation: "High volumes decreased unit production costs." },
    ],
    chapterEnd: [
      { id: "hist5-end-1", topic: "Steam Engine", question: "Origin country of Industrialisation?", options: ["Great Britain", "Germany", "France", "United States"], correctIndex: 0, explanation: "Began in England." },
      { id: "hist5-end-2", topic: "Steam Engine", question: "Improved Steam Engine inventor?", options: ["James Watt", "Newcomen", "Stephenson", "Fulton"], correctIndex: 0, explanation: "Watt modified the engine." },
      { id: "hist5-end-3", topic: "Factories", question: "Jenny machine used in?", options: ["Textile", "Steel", "Mining", "Farming"], correctIndex: 0, explanation: "Spinning Jenny spun thread." },
      { id: "hist5-end-4", topic: "Urban Growth", question: "Shift to cities name?", options: ["Urbanisation", "Globalisation", "Migration only", "Colonisation"], correctIndex: 0, explanation: "Known as Urbanisation." },
      { id: "hist5-end-5", topic: "Factories", question: "Result of assembly/machinery?", options: ["Mass production", "Higher prices", "Less goods", "Rural shift"], correctIndex: 0, explanation: "Automated work led to mass production." },
    ],
  },
];

// Helper: Get quiz data for a specific chapter
export function getChapterQuiz(chapterId: string): ChapterQuizData | undefined {
  return chapterQuizzes.find((q) => q.chapterId === chapterId);
}
