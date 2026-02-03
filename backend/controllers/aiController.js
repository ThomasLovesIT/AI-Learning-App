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
        const { documentId, numQuestions = 5, title } = req.body;
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
        const questions = await geminiService.generateQuiz(
            document.extractedText,
            parseInt(numQuestions)
        );

       

        // 4. Create the Quiz Record using the CORRECT MODEL (Quiz)
        const newQuiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`, // Generate a title
            questions: questions,
            totalQuestions: questions.length, 
            userAnswer: [],
            score: 0
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
