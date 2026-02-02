 import Document from '../models/Document.js'
 import Flashcard from '../models/Flashcards.js'
 import Quiz from '../models/Quiz.js'
 import ChatHistory from '../models/ChatHistory.js'
 import * as geminiService from '../utils/geminiService.js'
 import { findRelevantChunks } from '../utils/textChunker.js'

 
 
 
 
 export const generateFlashcards = async (req, res, next) => {
    try{
      const {documentId, count = 10} = req.body

      if(!documentId){
         return res.status(400).json({
            success: false,
            message:'please provide a documentId',
            statusCode: 400
         })
      }

      const document = await Document.findOne({
         _id: documentId,
         userId: req.user._id,
         status: 'ready'
      })
      if(!document){
         return res.status(400).json({
            success: false,
            message:'Document not found',
            statusCode: 400
         })
      }
      //generate flashcards using geminiService
      const cards = await geminiService.generateFlashcards(
         document.extractedText,
         parseInt(count)
      )

      //save to the database
      const flashcardSet = await Flashcard.create({
         userId: req.user._id,
         documentId: document._id,
         cards: cards.map(card => ({
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            reviewCount: 0,
            isStarred: false
         }))
      });


      res.status(201).json({
         success:true,
         data: flashcardSet,
         message:'Flashcard successfully created',
         statusCode: 201
      })
    }catch(error){
      console.error(error.message)
      res.status(500).json({message: 'Internal server error'})
    }

 }

export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5 } = req.body;
        // 1. Basic Validation
        if (!documentId) {
            return res.status(400).json({
                success: false, // Corrected spelling from 'falase'
                message: 'Please provide a document Id',
                statusCode: 400
            });
        }
        // 2. Find the Document
        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id,
            status: 'ready'
        });
        
        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found or not ready.',
                statusCode: 404
            });
        }

        // 3. Generate Questions using geminiService
        // Ensure numQuestions is passed as a number, which you are doing: parseInt(numQuestions)
        const generatedQuestions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

        if (!generatedQuestions || generatedQuestions.length === 0) {
             return res.status(500).json({
                success: false,
                message: 'Failed to generate any quiz questions from the text.',
                statusCode: 500
            });
        }
        
        // 4. Map the service output to the Quiz Model structure
        // The service output *already* closely matches the structure of the 'questions' array, 
        // so we just need to ensure the structure adheres to the Quiz schema constraints.
        const quizQuestionsData = generatedQuestions.map(q => ({
            question: q.question,
            // Ensure options is an array of 4 strings
            options: q.options && Array.isArray(q.options) && q.options.length === 4 
                     ? q.options 
                     : ["Option A", "Option B", "Option C", "Option D"], // Fallback/Error Handling
            
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            
            // Map to expected enum values ('Easy', 'Medium', 'Hard')
            difficulty: q.difficulty && ['easy', 'medium', 'hard'].includes(q.difficulty.toLowerCase())
                        ? q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1).toLowerCase() // Capitalize first letter
                        : 'Medium'
        }));

        // 5. Create the Quiz Record using the CORRECT MODEL (Quiz)
        const newQuiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            // Required field
            title: `Quiz for ${document.title || 'Document'}`, // Generate a title
            // Required field
            totalQuestions: quizQuestionsData.length, 
            questions: quizQuestionsData,
        });

        // 6. Send Success Response
        return res.status(201).json({
            success: true,
            message: 'Quiz generated and saved successfully!',
            statusCode: 201,
            quiz: newQuiz
        });

    } catch (error) {
        console.error('QUIZ GENERATION ERROR:', error);
        // Pass error to the error handling middleware (next(error)) or send a generic response
        next(error); 
    }
}
 export const generateSummary = async (req, res, next) => {
 try{

    }catch(error){
        
    }
 }
 export const chat = async (req, res, next) => {
 try{

    }catch(error){
        
    }
 }
 export const explainConcept = async (req, res, next) => {
 try{

    }catch(error){
        
    }
 }
 export const getChatHistory = async (req, res, next) => {
 try{

    }catch(error){
        
    }
 }
