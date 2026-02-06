import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();


if (!process.env.GEMINI_API_KEY) {
  console.error('FATAL ERROR: GEMINI API KEY IS NOT SET IN ENV FILE');
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generate flashcards from text
 * @param {string} text
 * @param {number} count
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  // Prompt for Gemini
  const prompt = `Generate exactly ${count} educational flashcards from the following text.

Format each flashcard as:
Q: [clear, specific question]
A: [concise, accurate answer]
D: [difficulty level: easy, medium, hard]

Separate each flashcard with "---"

Text:
${text.substring(0, 15000)}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: prompt,
    });

    // Get raw AI text
    const generatedText = response.text;

    // Parse the response
    const flashcards = [];
    const cards = generatedText.split('---').filter(c => c.trim());

    for (const card of cards) {
      const lines = card.trim().split('\n');

      let question = '';
      let answer = '';
      let difficulty = 'medium';

      for (const line of lines) {
        if (line.startsWith('Q:')) {
          question = line.substring(2).trim();
        } else if (line.startsWith('A:')) {
          answer = line.substring(2).trim();
        } else if (line.startsWith('D:')) {
          const diff = line.substring(2).trim().toLowerCase();
          if (['easy', 'medium', 'hard'].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    return flashcards;

  } catch (err) {
    console.error('Gemini API ERROR:', err);
    throw new Error('Failed to generate flashcards');
  }
};

/**
 * Generate Quiz Questions
 * @param {string} text
 * @param {number} numQuestions
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string , difficulty: string}>>}
 */

export const generateQuiz = async (text, numQuestions = 5) => {
  const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
Format each question as:
Q: [Question]
O1: [Option 1]
O2: [Option 2]
O3: [Option 3]
O4: [Option 4]
C: [Correct option - exactly as written above]
E: [Brief explanation]
D: [Difficulty: easy, medium, or hard]

Separate questions with "---"

Text:
${text.substring(0, 15000)}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
  });

  const generatedText = response.text;

  const questions = [];
  const questionBlocks = generatedText.split('---').filter(q => q.trim());

  for (const block of questionBlocks) {
    const lines = block.trim().split("\n");

    let question = "";
    let options = [];
    let correctAnswer = "";
    let explanation = "";
    let difficulty = "medium";

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("Q:")) {
        question = trimmed.substring(2).trim();
      } 
      else if (trimmed.match(/^O[1-4]:/)) { // ✅ FIX
        options.push(trimmed.substring(3).trim());
      } 
      else if (trimmed.startsWith("C:")) {
        correctAnswer = trimmed.substring(2).trim();
      } 
      else if (trimmed.startsWith("E:")) {
        explanation = trimmed.substring(2).trim();
      } 
      else if (trimmed.startsWith("D:")) {
        const diff = trimmed.substring(2).trim().toLowerCase();
        if (["easy", "medium", "hard"].includes(diff)) {
          difficulty = diff;
        }
      }
    }

    if (question && options.length === 4 && correctAnswer) {
      questions.push({ question, options, correctAnswer, explanation, difficulty });
    }
  }

  return questions; // ✅ FIX
};



/**
 * Generate Summary
 * @param {string} text
 * @returns {Promise<Array>}
 */

export const generateSummary = async (text) => {
const prompt = `
Summarize the following text.
Highlight key concepts, main ideas, and important points.
Do not add introductions like "Here is the summary".

TEXT:
${text}
`;



    try{
        // store the ai resposne text
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      });
      const generatedText = response.text;
      return generatedText

  }catch(err){
  console.error('Gemini API ERROR:', err);
      throw new Error('Failed to generate flashcards');
  }

}
/**
 * Generate chat with context
 * @param {string} question
 * @param {Array<Object>} chunks
 * @returns {Promise<Array>}
 */

export const chatWithContext = async (question, chunks) => {
  const context = chunks.map((c, i) => `[Chunk ${i + 1}]\m$(c.content)`).join(`\n\n`)

  console.log('context____', context)

  const prompt = `Based on the following context from a document, Analyze the context and answe the user's question. If the answer is on in the context then let the user know
  
  Context:
  ${context}
  
  Question: ${question}
  
  Answer: `

    try{
        // store the ai resposne text
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      });
      const generatedText = response.text;
      return generatedText

  }catch(err){
  console.error('Gemini API ERROR:', err);
      throw new Error('Failed to generate flashcards');
  }

}

/**
 * Generate Explain concept from ai
 * @param {string} concept
 * @param {string} question
 * @returns {Promise<Array>}
 */
export const explainConcept = async (concept, question) => {
  const prompt = `Explain the concept of "${concept}" based on the following context,
  provide a clear, educational explanation that's easy to understand. Include examples if relevant
  
  Context: 
  ${context.substring(0,10000)}`

  try{  
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
      });

      const generatedText = response.text
      return generatedText
  }catch(err){
      console.error('Internal server error' || err.message)
      throw new Error('Failed to expain concept')
  }
}