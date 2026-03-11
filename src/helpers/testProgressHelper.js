
// /**
//  * Save test score after completion
//  * @param {string} category - Main category (e.g., "math", "English")
//  * @param {string} subcategory - Subcategory (e.g., "Number System")
//  * @param {number} testIndex - Index of the test within subcategory
//  * @param {number} scorePercentage - Score percentage (0-100)
//  * @param {boolean} isIndividualTest - Whether this is an individual subcategory test (not custom multi-subcategory)
//  */
// export const saveTestScore = (
//   category,
//   subcategory,
//   testIndex,
//   scorePercentage,
//   isIndividualTest = true,
// ) => {
//   // Only save progress for individual subcategory tests
//   // Do NOT save for custom tests with multiple subcategories selected
//   if (!isIndividualTest) {
//     console.log("⚠️ Skipping progress save - this is a custom multi-subcategory test");
//     return null;
//   }

//   const progressKey = "testProgress";
//   const progress = JSON.parse(localStorage.getItem(progressKey)) || {};

//   // Initialize category if it doesn't exist
//   if (!progress[category]) {
//     progress[category] = {};
//   }

//   // Initialize subcategory if it doesn't exist
//   if (!progress[category][subcategory]) {
//     progress[category][subcategory] = {};
//   }

//   // Get existing score to preserve completion status if already completed
//   const existingTest = progress[category][subcategory][testIndex];
//   const wasCompleted = existingTest?.completed === true;

//   // Save the score - once completed (80% or higher), it stays completed
//   progress[category][subcategory][testIndex] = {
//     score: scorePercentage,
//     completed: wasCompleted || scorePercentage >= 80,
//     timestamp: new Date().toISOString(),
//   };

//   localStorage.setItem(progressKey, JSON.stringify(progress));

//   // Check and update subcategory completion
//   updateSubcategoryCompletion(category, subcategory);

//   return progress;
// };

// /**
//  * Check if a specific test is unlocked
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} testIndex - Index of the test
//  * @returns {boolean} - Whether the test is unlocked
//  */
// export const isTestUnlocked = (category, subcategory, testIndex) => {
//   // First test is always unlocked
//   if (testIndex === 0) return true;

//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};

//   // Check if previous test exists and is completed (80% or higher)
//   const previousTestIndex = testIndex - 1;
//   const previousTest = progress?.[category]?.[subcategory]?.[previousTestIndex];

//   return previousTest?.completed === true;
// };

// /**
//  * Check if a subcategory is unlocked
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  * @param {number} subcategoryIndex - Index of subcategory in the list
//  * @returns {boolean} - Whether the subcategory is unlocked
//  */
// export const isSubcategoryUnlocked = (category, subcategoryIndex) => {
//   // First subcategory is always unlocked
//   if (subcategoryIndex === 0) return true;

//   const completion =
//     JSON.parse(localStorage.getItem("subcategoryCompletion")) || {};

//   // Check if previous subcategory is completed (all tests at 80% or higher)
//   const previousSubcategoryIndex = subcategoryIndex - 1;
//   const previousCompleted = completion?.[category]?.[previousSubcategoryIndex];

//   return previousCompleted === true;
// };

// /**
//  * Get test score for a specific test
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} testIndex - Index of the test
//  * @returns {object|null} - Test data with score and completion status
//  */
// export const getTestScore = (category, subcategory, testIndex) => {
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
//   return progress?.[category]?.[subcategory]?.[testIndex] || null;
// };

// /**
//  * Check if all tests in a subcategory are completed with 80% or higher
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} totalTests - Total number of tests in the subcategory
//  * @returns {boolean} - Whether all tests are completed
//  */
// export const isSubcategoryCompleted = (category, subcategory, totalTests) => {
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
//   const subcategoryProgress = progress?.[category]?.[subcategory] || {};

//   // Check if all tests exist and are completed (80% or higher)
//   for (let i = 0; i < totalTests; i++) {
//     const test = subcategoryProgress[i];
//     if (!test || !test.completed) {
//       return false;
//     }
//   }

//   return true;
// };

// /**
//  * Update subcategory completion status
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  */
// const updateSubcategoryCompletion = (category, subcategory) => {
//   const completionKey = "subcategoryCompletion";
//   const completion = JSON.parse(localStorage.getItem(completionKey)) || {};

//   if (!completion[category]) {
//     completion[category] = {};
//   }

//   // Get all subcategories for this category
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];
//   const subcategoryTests = questionData.filter((q) => q.topic === subcategory);

//   if (subcategoryTests.length > 0) {
//     const allCompleted = isSubcategoryCompleted(
//       category,
//       subcategory,
//       subcategoryTests.length,
//     );

//     // Find the index of this subcategory
//     const allSubcategories = getSubcategoriesForCategory(category);
//     const subcategoryIndex = allSubcategories.indexOf(subcategory);

//     if (subcategoryIndex !== -1) {
//       // Once completed, it stays completed
//       const wasCompleted = completion[category][subcategoryIndex] === true;
//       completion[category][subcategoryIndex] = wasCompleted || allCompleted;
//       localStorage.setItem(completionKey, JSON.stringify(completion));
//     }
//   }
// };

// /**
//  * Get list of all subcategories for a category
//  * @param {string} category - Main category
//  * @returns {array} - Array of subcategory names
//  */
// const getSubcategoriesForCategory = (category) => {
//   // Map category codes to their subcategory lists
//   const subcategoryMap = {
//     math: [
//       "Number System",
//       "L.C.M and H.C.F",
//       "Surds and Indices",
//       "Algebraic Identities",
//       "Percentage",
//       "Profit and Loss",
//       "Simple Interest",
//       "Compound Interest",
//       "Average",
//       "Ratio and Proportion",
//       "Partnership",
//       "Problems with Ages",
//       "Time and Distance",
//       "Pipe and Cistern",
//       "Mixture and Alligation",
//       "Problems based on Train, Boat, and Stream",
//       "Mensuration 2D & 3D",
//       "Coordinate Geometry",
//       "Trigonometry",
//       "Data Interpretation",
//       "General Studies",
//     ],
//     Eng: [
//       "Spot the Error",
//       "Reading Comprehension",
//       "Synonyms",
//       "Antonyms",
//       "Fill in the Blanks",
//       "Sentence Improvement",
//       "Spotting Errors",
//       "Para Jumbles",
//       "Idioms & Phrases",
//       "One Word Substitution",
//       "Active and Passive Voice",
//       "Direct and Indirect Speech",
//       "Cloze Test",
//       "Sentence Completion",
//       "Vocabulary",
//       "Prepositions",
//       "Articles",
//       "Tenses",
//       "Subject-Verb Agreement",
//       "Phrasal Verbs",
//     ],
//     mathtwo: [
//       "Average Wala",
//       "mathtwo",
//       "Police and Thief",
//       "Time and Distance (Meeting Wala)",
//       "Time and distance basic",
//       "Train Wala (Relative Speed)",
//     ],
//     gs: ["Vedic age", "Polity", "Ancient History"],
//     vocabulary: [
//       "One Word Substitution",
//       "Idioms",
//       "Antonyms",
//       "Synonyms",
//       "Phrasal Verbs",
//     ],
//   };

//   return subcategoryMap[category] || [];
// };

// /**
//  * Check if category is fully completed (all subcategories done)
//  * @param {string} category - Main category
//  * @returns {boolean} - Whether category is fully completed
//  */
// export const isCategoryCompleted = (category) => {
//   const subcategories = getSubcategoriesForCategory(category);
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];

//   for (const subcategory of subcategories) {
//     const tests = questionData.filter((q) => q.topic === subcategory);
//     if (tests.length === 0) continue; // Skip if no tests exist

//     if (!isSubcategoryCompleted(category, subcategory, tests.length)) {
//       return false;
//     }
//   }

//   return subcategories.length > 0; // Only return true if there are subcategories
// };

// /**
//  * Get progress statistics for a category
//  * @param {string} category - Main category
//  * @returns {object} - Progress stats
//  */
// export const getCategoryProgress = (category) => {
//   const subcategories = getSubcategoriesForCategory(category);
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];

//   let completedSubcategories = 0;
//   let totalTests = 0;
//   let completedTests = 0;

//   for (const subcategory of subcategories) {
//     const tests = questionData.filter((q) => q.topic === subcategory);
//     totalTests += tests.length;

//     if (
//       tests.length > 0 &&
//       isSubcategoryCompleted(category, subcategory, tests.length)
//     ) {
//       completedSubcategories++;
//       completedTests += tests.length;
//     } else {
//       // Count individual completed tests
//       for (let i = 0; i < tests.length; i++) {
//         const testScore = getTestScore(category, subcategory, i);
//         if (testScore?.completed) {
//           completedTests++;
//         }
//       }
//     }
//   }

//   return {
//     totalSubcategories: subcategories.length,
//     completedSubcategories,
//     totalTests,
//     completedTests,
//     percentComplete:
//       totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0,
//   };
// };

// /**
//  * Get total correct answers for a subcategory across all tests
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  * @returns {object} - { totalCorrect, totalQuestions, percentage }
//  */
// export const getSubcategoryStats = (category, subcategory) => {
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
  
//   const tests = questionData.filter((q) => q.topic === subcategory);
//   const subcategoryProgress = progress?.[category]?.[subcategory] || {};
  
//   let totalCorrect = 0;
//   let totalQuestions = 0;
  
//   tests.forEach((test, index) => {
//     const testData = subcategoryProgress[index];
//     if (testData && test.question) {
//       const questionsInTest = test.question.length;
//       totalQuestions += questionsInTest;
      
//       // Calculate correct answers: (score% / 100) * totalQuestions
//       const correctAnswers = Math.round((testData.score / 100) * questionsInTest);
//       totalCorrect += correctAnswers;
//     } else if (test.question) {
//       // Test not attempted yet
//       totalQuestions += test.question.length;
//     }
//   });
  
//   const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
//   return {
//     totalCorrect,
//     totalQuestions,
//     percentage,
//     completed: tests.length > 0 && isSubcategoryCompleted(category, subcategory, tests.length)
//   };
// };

// /**
//  * Reset all progress (useful for testing)
//  */
// export const resetAllProgress = () => {
//   localStorage.removeItem("testProgress");
//   localStorage.removeItem("subcategoryCompletion");
// };


// --------------------------------------------------------------------------=============================================================================


















// // testProgressHelper.js
// // Helper functions to manage test progress, scores, and unlock logic

// /**
//  * Save test score after completion
//  * @param {string} category - Main category (e.g., "math", "English")
//  * @param {string} subcategory - Subcategory (e.g., "Number System")
//  * @param {number} testIndex - Index of the test within subcategory
//  * @param {number} scorePercentage - Score percentage (0-100)
//  * @param {boolean} isIndividualTest - Whether this is an individual subcategory test (not custom multi-subcategory)
//  */
// export const saveTestScore = (
//   category,
//   subcategory,
//   testIndex,
//   scorePercentage,
//   isIndividualTest = true,
// ) => {
//   // Only save progress for individual subcategory tests
//   // Do NOT save for custom tests with multiple subcategories selected
//   if (!isIndividualTest) {
//     console.log("⚠️ Skipping progress save - this is a custom multi-subcategory test");
//     return null;
//   }

//   const progressKey = "testProgress";
//   const progress = JSON.parse(localStorage.getItem(progressKey)) || {};

//   // Initialize category if it doesn't exist
//   if (!progress[category]) {
//     progress[category] = {};
//   }

//   // Initialize subcategory if it doesn't exist
//   if (!progress[category][subcategory]) {
//     progress[category][subcategory] = {};
//   }

//   // Get existing score to preserve completion status if already completed
//   const existingTest = progress[category][subcategory][testIndex];
//   const wasCompleted = existingTest?.completed === true;

//   // Save the score - once completed (80% or higher), it stays completed
//   progress[category][subcategory][testIndex] = {
//     score: scorePercentage,
//     completed: wasCompleted || scorePercentage >= 80,
//     timestamp: new Date().toISOString(),
//   };

//   localStorage.setItem(progressKey, JSON.stringify(progress));

//   // Check and update subcategory completion
//   updateSubcategoryCompletion(category, subcategory);

//   return progress;
// };

// /**
//  * Check if a specific test is unlocked
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} testIndex - Index of the test
//  * @returns {boolean} - Whether the test is unlocked
//  */
// export const isTestUnlocked = (category, subcategory, testIndex) => {
//   // First test is always unlocked
//   if (testIndex === 0) return true;

//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};

//   // Check if previous test exists and is completed (80% or higher)
//   const previousTestIndex = testIndex - 1;
//   const previousTest = progress?.[category]?.[subcategory]?.[previousTestIndex];

//   return previousTest?.completed === true;
// };

// /**
//  * Check if a subcategory is unlocked
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  * @param {number} subcategoryIndex - Index of subcategory in the list
//  * @returns {boolean} - Whether the subcategory is unlocked
//  */
// export const isSubcategoryUnlocked = (category, subcategoryIndex) => {
//   // First subcategory is always unlocked
//   if (subcategoryIndex === 0) return true;

//   const completion =
//     JSON.parse(localStorage.getItem("subcategoryCompletion")) || {};

//   // Check if previous subcategory is completed (all tests at 80% or higher)
//   const previousSubcategoryIndex = subcategoryIndex - 1;
//   const previousCompleted = completion?.[category]?.[previousSubcategoryIndex];

//   return previousCompleted === true;
// };

// /**
//  * Get test score for a specific test
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} testIndex - Index of the test
//  * @returns {object|null} - Test data with score and completion status
//  */
// export const getTestScore = (category, subcategory, testIndex) => {
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
//   return progress?.[category]?.[subcategory]?.[testIndex] || null;
// };

// /**
//  * Check if all tests in a subcategory are completed with 80% or higher
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory
//  * @param {number} totalTests - Total number of tests in the subcategory
//  * @returns {boolean} - Whether all tests are completed
//  */
// export const isSubcategoryCompleted = (category, subcategory, totalTests) => {
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
//   const subcategoryProgress = progress?.[category]?.[subcategory] || {};

//   // Check if all tests exist and are completed (80% or higher)
//   for (let i = 0; i < totalTests; i++) {
//     const test = subcategoryProgress[i];
//     if (!test || !test.completed) {
//       return false;
//     }
//   }

//   return true;
// };

// /**
//  * Update subcategory completion status
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  */
// const updateSubcategoryCompletion = (category, subcategory) => {
//   const completionKey = "subcategoryCompletion";
//   const completion = JSON.parse(localStorage.getItem(completionKey)) || {};

//   if (!completion[category]) {
//     completion[category] = {};
//   }

//   // Get all subcategories for this category
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];
//   const subcategoryTests = questionData.filter((q) => q.topic === subcategory);

//   if (subcategoryTests.length > 0) {
//     const allCompleted = isSubcategoryCompleted(
//       category,
//       subcategory,
//       subcategoryTests.length,
//     );

//     // Find the index of this subcategory
//     const allSubcategories = getSubcategoriesForCategory(category);
//     const subcategoryIndex = allSubcategories.indexOf(subcategory);

//     if (subcategoryIndex !== -1) {
//       // Once completed, it stays completed
//       const wasCompleted = completion[category][subcategoryIndex] === true;
//       completion[category][subcategoryIndex] = wasCompleted || allCompleted;
//       localStorage.setItem(completionKey, JSON.stringify(completion));
//     }
//   }
// };

// /**
//  * Get list of all subcategories for a category
//  * @param {string} category - Main category
//  * @returns {array} - Array of subcategory names
//  */
// const getSubcategoriesForCategory = (category) => {
//   // Map category codes to their subcategory lists
//   const subcategoryMap = {
//     math: [
//       "Number System",
//       "L.C.M and H.C.F",
//       "Surds and Indices",
//       "Algebraic Identities",
//       "Percentage",
//       "Profit and Loss",
//       "Simple Interest",
//       "Compound Interest",
//       "Average",
//       "Ratio and Proportion",
//       "Partnership",
//       "Problems with Ages",
//       "Time and Distance",
//       "Pipe and Cistern",
//       "Mixture and Alligation",
//       "Problems based on Train, Boat, and Stream",
//       "Mensuration 2D & 3D",
//       "Coordinate Geometry",
//       "Trigonometry",
//       "Data Interpretation",
//       "General Studies",
//     ],
//     Eng: [
//       "Spot the Error",
//       "Reading Comprehension",
//       "Synonyms",
//       "Antonyms",
//       "Fill in the Blanks",
//       "Sentence Improvement",
//       "Spotting Errors",
//       "Para Jumbles",
//       "Idioms & Phrases",
//       "One Word Substitution",
//       "Active and Passive Voice",
//       "Direct and Indirect Speech",
//       "Cloze Test",
//       "Sentence Completion",
//       "Vocabulary",
//       "Prepositions",
//       "Articles",
//       "Tenses",
//       "Subject-Verb Agreement",
//       "Phrasal Verbs",
//     ],
//     mathtwo: [
//       "Average Wala",
//       "mathtwo",
//       "Police and Thief",
//       "Time and Distance (Meeting Wala)",
//       "Time and distance basic",
//       "Train Wala (Relative Speed)",
//     ],
//     gs: [
//       "Vedic age",
//       "Polity",
//       "Ancient History",
//     ],
//     vocabulary: [
//       "One Word Substitution",
//       "Idioms",
//       "Antonyms",
//       "Synonyms",
//       "Phrasal Verbs",
//     ],
//     Reasoning: [
//       "Logical Reasoning",
//       "Analytical Reasoning",
//       "Verbal Reasoning",
//       "Non-Verbal Reasoning",
//       "Blood Relations",
//       "Coding-Decoding",
//       "Puzzles",
//       "Seating Arrangement",
//       "Syllogism",
//       "Data Sufficiency",
//     ],
//   };

//   return subcategoryMap[category] || [];
// };

// /**
//  * Check if category is fully completed (all subcategories done)
//  * @param {string} category - Main category
//  * @returns {boolean} - Whether category is fully completed
//  */
// export const isCategoryCompleted = (category) => {
//   const subcategories = getSubcategoriesForCategory(category);
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];

//   for (const subcategory of subcategories) {
//     const tests = questionData.filter((q) => q.topic === subcategory);
//     if (tests.length === 0) continue; // Skip if no tests exist

//     if (!isSubcategoryCompleted(category, subcategory, tests.length)) {
//       return false;
//     }
//   }

//   return subcategories.length > 0; // Only return true if there are subcategories
// };

// /**
//  * Get progress statistics for a category
//  * @param {string} category - Main category
//  * @returns {object} - Progress stats
//  */
// export const getCategoryProgress = (category) => {
//   const subcategories = getSubcategoriesForCategory(category);
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];

//   let completedSubcategories = 0;
//   let totalTests = 0;
//   let completedTests = 0;

//   for (const subcategory of subcategories) {
//     const tests = questionData.filter((q) => q.topic === subcategory);
//     totalTests += tests.length;

//     if (
//       tests.length > 0 &&
//       isSubcategoryCompleted(category, subcategory, tests.length)
//     ) {
//       completedSubcategories++;
//       completedTests += tests.length;
//     } else {
//       // Count individual completed tests
//       for (let i = 0; i < tests.length; i++) {
//         const testScore = getTestScore(category, subcategory, i);
//         if (testScore?.completed) {
//           completedTests++;
//         }
//       }
//     }
//   }

//   return {
//     totalSubcategories: subcategories.length,
//     completedSubcategories,
//     totalTests,
//     completedTests,
//     percentComplete:
//       totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0,
//   };
// };

// /**
//  * Get total correct answers for a subcategory across all tests
//  * @param {string} category - Main category
//  * @param {string} subcategory - Subcategory name
//  * @returns {object} - { totalCorrect, totalQuestions, percentage }
//  */
// export const getSubcategoryStats = (category, subcategory) => {
//   const questionData = JSON.parse(localStorage.getItem("questiondata")) || [];
//   const progress = JSON.parse(localStorage.getItem("testProgress")) || {};
  
//   const tests = questionData.filter((q) => q.topic === subcategory);
//   const subcategoryProgress = progress?.[category]?.[subcategory] || {};
  
//   let totalCorrect = 0;
//   let totalQuestions = 0;
  
//   tests.forEach((test, index) => {
//     const testData = subcategoryProgress[index];
//     if (testData && test.question) {
//       const questionsInTest = test.question.length;
//       totalQuestions += questionsInTest;
      
//       // Calculate correct answers: (score% / 100) * totalQuestions
//       const correctAnswers = Math.round((testData.score / 100) * questionsInTest);
//       totalCorrect += correctAnswers;
//     } else if (test.question) {
//       // Test not attempted yet
//       totalQuestions += test.question.length;
//     }
//   });
  
//   const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  
//   return {
//     totalCorrect,
//     totalQuestions,
//     percentage,
//     completed: tests.length > 0 && isSubcategoryCompleted(category, subcategory, tests.length)
//   };
// };

// /**
//  * Reset all progress (useful for testing)
//  */
// export const resetAllProgress = () => {
//   localStorage.removeItem("testProgress");
//   localStorage.removeItem("subcategoryCompletion");
// };






// ---------------------------up-----------------------------------------------------------













// testProgressHelper.js
// Helper functions to manage test progress, scores, and unlock logic

const PROGRESS_KEY = "testProgress";
const COMPLETION_KEY = "subcategoryCompletion";
const PASS_THRESHOLD = 80;

// ---------------------------------------------------------------------------
// API helpers  (topic list + questions come from the backend)
// ---------------------------------------------------------------------------

/**
 * Fetch all topics/subcategories for a given subject from the backend.
 * @param {string} subject  - e.g. "math", "Eng"
 * @returns {Promise<string[]>} - Array of topic names
 */
export const fetchTopicsForSubject = async (subject) => {
  const res = await fetch(`/api/topics?subject=${encodeURIComponent(subject)}`);
  if (!res.ok) throw new Error(`Failed to fetch topics: ${res.status}`);
  const data = await res.json();
  // Accept either { topics: [...] }  or a plain array
  return Array.isArray(data) ? data : data.topics ?? [];
};

/**
 * Fetch tests/questions for a specific subject + topic from the backend.
 * @param {string} subject  - e.g. "math"
 * @param {string} topic    - e.g. "Number System"
 * @returns {Promise<object[]>} - Array of test objects
 */
export const fetchQuestions = async (subject, topic) => {
  const res = await fetch(
    `/api/questions?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(topic)}`
  );
  if (!res.ok) throw new Error(`Failed to fetch questions: ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.tests ?? [];
};

// ---------------------------------------------------------------------------
// Progress persistence helpers
// ---------------------------------------------------------------------------

const loadProgress = () =>
  JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {};

const loadCompletion = () =>
  JSON.parse(localStorage.getItem(COMPLETION_KEY)) || {};

// ---------------------------------------------------------------------------
// Unlock checks  (signatures match what MathQuestionlist.jsx passes)
// ---------------------------------------------------------------------------

/**
 * Check if a subcategory (by list-index) is unlocked for the current user.
 * The first subcategory is always unlocked.
 *
 * @param {number} subcategoryIndex - Zero-based position in the topic list
 * @param {object|null} user        - Auth user object (reserved for future role-based rules)
 * @returns {boolean}
 */
export const isSubcategoryUnlocked = (subcategoryIndex, user) => {
  if (subcategoryIndex === 0) return true;

  const completion = loadCompletion();

  // Completion is stored flat by index under each category key.
  // We check every category since MathQuestionlist doesn't pass a category.
  return Object.values(completion).some(
    (catMap) => catMap[subcategoryIndex - 1] === true
  );
};

/**
 * Check if a test (by list-index) is unlocked for the current user.
 * The first test is always unlocked.
 *
 * @param {number} testIndex  - Zero-based position in the test list
 * @param {object|null} user  - Auth user object (reserved for future role-based rules)
 * @returns {boolean}
 */
export const isTestUnlocked = (testIndex, user) => {
  if (testIndex === 0) return true;

  const progress = loadProgress();

  // Walk every stored category → subcategory and look for the previous index
  // being marked completed (score >= PASS_THRESHOLD).
  for (const catData of Object.values(progress)) {
    for (const subData of Object.values(catData)) {
      const prev = subData[testIndex - 1];
      if (prev?.completed === true) return true;
    }
  }
  return false;
};

// ---------------------------------------------------------------------------
// Score persistence
// ---------------------------------------------------------------------------

/**
 * Save test score after completion.
 * Only saves progress for individual subcategory tests (not custom multi-subcategory).
 *
 * @param {string}  category         - Main category key (e.g. "math", "Eng")
 * @param {string}  subcategory      - Topic name (e.g. "Number System")
 * @param {number}  testIndex        - Zero-based index within the subcategory
 * @param {number}  scorePercentage  - 0-100
 * @param {boolean} isIndividualTest - false → skip saving (custom multi-sub test)
 * @returns {object|null} Updated progress or null if skipped
 */
export const saveTestScore = (
  category,
  subcategory,
  testIndex,
  scorePercentage,
  isIndividualTest = true
) => {
  if (!isIndividualTest) {
    console.log("⚠️ Skipping progress save – custom multi-subcategory test");
    return null;
  }

  const progress = loadProgress();

  progress[category] ??= {};
  progress[category][subcategory] ??= {};

  const existing = progress[category][subcategory][testIndex];
  const alreadyPassed = existing?.completed === true;

  progress[category][subcategory][testIndex] = {
    score: scorePercentage,
    completed: alreadyPassed || scorePercentage >= PASS_THRESHOLD,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateSubcategoryCompletion(category, subcategory);

  return progress;
};

/**
 * Get stored score data for a specific test.
 *
 * @param {string} category
 * @param {string} subcategory
 * @param {number} testIndex
 * @returns {{ score: number, completed: boolean, timestamp: string }|null}
 */
export const getTestScore = (category, subcategory, testIndex) => {
  const progress = loadProgress();
  return progress?.[category]?.[subcategory]?.[testIndex] ?? null;
};

// ---------------------------------------------------------------------------
// Completion checks
// ---------------------------------------------------------------------------

/**
 * Returns true only when every test in the subcategory has been passed.
 *
 * @param {string} category
 * @param {string} subcategory
 * @param {number} totalTests
 * @returns {boolean}
 */
export const isSubcategoryCompleted = (category, subcategory, totalTests) => {
  const progress = loadProgress();
  const sub = progress?.[category]?.[subcategory] ?? {};

  for (let i = 0; i < totalTests; i++) {
    if (!sub[i]?.completed) return false;
  }
  return true;
};

/**
 * Returns true when every subcategory in the category is fully completed.
 *
 * @param {string} category
 * @returns {boolean}
 */
export const isCategoryCompleted = (category) => {
  const subcategories = getSubcategoriesForCategory(category);
  if (subcategories.length === 0) return false;

  const questionData =
    JSON.parse(localStorage.getItem("questiondata")) || [];

  for (const subcategory of subcategories) {
    const tests = questionData.filter((q) => q.topic === subcategory);
    if (tests.length === 0) continue; // no data → skip rather than block
    if (!isSubcategoryCompleted(category, subcategory, tests.length))
      return false;
  }
  return true;
};

// ---------------------------------------------------------------------------
// Progress statistics
// ---------------------------------------------------------------------------

/**
 * Aggregate progress numbers for a whole category.
 *
 * @param {string} category
 * @returns {{ totalSubcategories, completedSubcategories, totalTests, completedTests, percentComplete }}
 */
export const getCategoryProgress = (category) => {
  const subcategories = getSubcategoriesForCategory(category);
  const questionData =
    JSON.parse(localStorage.getItem("questiondata")) || [];

  let completedSubcategories = 0;
  let totalTests = 0;
  let completedTests = 0;

  for (const subcategory of subcategories) {
    const tests = questionData.filter((q) => q.topic === subcategory);
    totalTests += tests.length;

    if (
      tests.length > 0 &&
      isSubcategoryCompleted(category, subcategory, tests.length)
    ) {
      completedSubcategories++;
      completedTests += tests.length;
    } else {
      for (let i = 0; i < tests.length; i++) {
        if (getTestScore(category, subcategory, i)?.completed) completedTests++;
      }
    }
  }

  return {
    totalSubcategories: subcategories.length,
    completedSubcategories,
    totalTests,
    completedTests,
    percentComplete:
      totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0,
  };
};

/**
 * Correct-answer stats across all tests in a subcategory.
 *
 * @param {string} category
 * @param {string} subcategory
 * @returns {{ totalCorrect, totalQuestions, percentage, completed }}
 */
export const getSubcategoryStats = (category, subcategory) => {
  const questionData =
    JSON.parse(localStorage.getItem("questiondata")) || [];
  const progress = loadProgress();

  const tests = questionData.filter((q) => q.topic === subcategory);
  const subProgress = progress?.[category]?.[subcategory] ?? {};

  let totalCorrect = 0;
  let totalQuestions = 0;

  tests.forEach((test, index) => {
    const qCount = test.question?.length ?? 0;
    totalQuestions += qCount;

    const testData = subProgress[index];
    if (testData && qCount > 0) {
      totalCorrect += Math.round((testData.score / 100) * qCount);
    }
  });

  return {
    totalCorrect,
    totalQuestions,
    percentage:
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0,
    completed:
      tests.length > 0 &&
      isSubcategoryCompleted(category, subcategory, tests.length),
  };
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

const updateSubcategoryCompletion = (category, subcategory) => {
  const completion = loadCompletion();
  completion[category] ??= {};

  const questionData =
    JSON.parse(localStorage.getItem("questiondata")) || [];
  const tests = questionData.filter((q) => q.topic === subcategory);
  if (tests.length === 0) return;

  const allSubcategories = getSubcategoriesForCategory(category);
  const idx = allSubcategories.indexOf(subcategory);
  if (idx === -1) return;

  const allDone = isSubcategoryCompleted(category, subcategory, tests.length);
  // Once completed, stays completed
  completion[category][idx] = completion[category][idx] === true || allDone;
  localStorage.setItem(COMPLETION_KEY, JSON.stringify(completion));
};

const getSubcategoriesForCategory = (category) => {
  const subcategoryMap = {
    math: [
      "Number System",
      "L.C.M and H.C.F",
      "Surds and Indices",
      "Algebraic Identities",
      "Percentage",
      "Profit and Loss",
      "Simple Interest",
      "Compound Interest",
      "Average",
      "Ratio and Proportion",
      "Partnership",
      "Problems with Ages",
      "Time and Distance",
      "Pipe and Cistern",
      "Mixture and Alligation",
      "Problems based on Train, Boat, and Stream",
      "Mensuration 2D & 3D",
      "Coordinate Geometry",
      "Trigonometry",
      "Data Interpretation",
      "General Studies",
    ],
    Eng: [
      "Spot the Error",
      "Reading Comprehension",
      "Synonyms",
      "Antonyms",
      "Fill in the Blanks",
      "Sentence Improvement",
      "Spotting Errors",
      "Para Jumbles",
      "Idioms & Phrases",
      "One Word Substitution",
      "Active and Passive Voice",
      "Direct and Indirect Speech",
      "Cloze Test",
      "Sentence Completion",
      "Vocabulary",
      "Prepositions",
      "Articles",
      "Tenses",
      "Subject-Verb Agreement",
      "Phrasal Verbs",
    ],
    mathtwo: [
      "Average Wala",
      "mathtwo",
      "Police and Thief",
      "Time and Distance (Meeting Wala)",
      "Time and distance basic",
      "Train Wala (Relative Speed)",
    ],
    gs: ["Vedic age", "Polity", "Ancient History"],
    vocabulary: [
      "One Word Substitution",
      "Idioms",
      "Antonyms",
      "Synonyms",
      "Phrasal Verbs",
    ],
    Reasoning: [
      "Logical Reasoning",
      "Analytical Reasoning",
      "Verbal Reasoning",
      "Non-Verbal Reasoning",
      "Blood Relations",
      "Coding-Decoding",
      "Puzzles",
      "Seating Arrangement",
      "Syllogism",
      "Data Sufficiency",
    ],
  };

  return subcategoryMap[category] ?? [];
};

// ---------------------------------------------------------------------------
// Dev utility
// ---------------------------------------------------------------------------

/** Wipe all stored progress (useful during development/testing). */
export const resetAllProgress = () => {
  localStorage.removeItem(PROGRESS_KEY);
  localStorage.removeItem(COMPLETION_KEY);
};