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
