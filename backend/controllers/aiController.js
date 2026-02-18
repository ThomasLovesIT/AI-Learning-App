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
     
   const {documentId} = req.body
   if(!documentId){
      return res.status(400).json({
         success: false,
         message: 'Internal Server Error',
         statusCode: 400
      })
   }
   const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status:'ready'
   })
   const summary = await geminiService.generateSummary(
      document.extractedText
   )
   res.status(201).json({
      success:true,
      data: {
         documentId: documentId,
         title: document.title,
         summary
      }
   })
      
}catch(error){
   next(error)
   res.status(500).json({message: 'Internal server error'})
}
 }
 export const chat = async (req, res, next) => {
 try{
      const { documentId, question } = req.body
      if(!documentId || !question ){
         return res.status(400).json({
            success: false,
            message: 'Please add a document Id and a prompt',
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
         message: 'Document not found',
         statusCode: 400
      })
   }
   
    //find relavant chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    let chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: document._id,
    })

   // create the chat history if not exist yet
    if(!chatHistory) {
      chatHistory = await ChatHistory.create({
              userId: req.user._id,
              documentId: document._id,
                messages: []
      })
    }
    // gemini answer generated
    const answer = await geminiService.chatWithContext(
      question,
      relevantChunks
    )

    //store the messages inside the chat history
    chatHistory.messages.push(
      {
         role: 'user',
         content: question,
         timestamp: new Date(),
         relevantChunks: []
      },
      {
          role: 'assistant',
         content: answer,
         timestamp: new Date(),
         relevantChunks: chunkIndices
      }
    )

    //Save the changes
    await chatHistory.save()


     res.status(201).json({
      success:true,
      data:{
         documentId,
         title: document.title,
        question,
        answer,
        relevantchunks: relevantChunks,
        chatHistoryId: chatHistory._id
      },
      message: 'response generated successfully'
   })

    }catch(error){
        next(error)
        res.status(500).json( error.message)
    }
 }
 export const explainConcept = async (req, res, next) => {
 try{
      const {documentId, concept} = req.body          
      
      if(!documentId || !concept) {
         return res.status(400).json({
            success: false,
            message: 'Please add a document or a topic',
            statusCode: 400
         })
      }

      const document = await Document.findOne({
         _id: documentId,
         userId: req.user._id,
         status: 'ready'
      })

      if (!document){
          return res.status(400).json({
            success: false,
            message: 'Document not found',
            statusCode: 400
         })
      }
         //find relavant chunks
         const relevantChunks = findRelevantChunks(document.chunks, concept, 10);
         const context = relevantChunks.map(c => c.content).join('\n\n');

      const conceptExplanation = await geminiService.explainConcept(
        concept,
        context 
      )

      res.status(201).json({
         success:true,
         data: {
            concept,
            conceptExplanation,
            relevantChunks: relevantChunks.map(c => c.chunkIndex)
         },
         message:'Concept explanation generated successfully',
      })

    }catch(error){
      next(error)
        console.error(error.message)
    }
 }
 export const getChatHistory = async (req, res, next) => {
 try{
      const {documentId} = req.params
      
      const chatArchive = await ChatHistory.findOne({
         userId: req.user._id,
         documentId: documentId
      }).select('messages')

      if (!chatArchive || chatArchive.messages.length === 0) {
         return res.status(200).json({
            success: true,
            message: 'No chat history yet',
            statusCode: 404,
            data: []
         }) 
      }

      res.status(200).json({
         success: true,
         data: chatArchive.messages,
         message: 'Chat history retrieved successfully'
      });

    }catch(error){
      next(error)
        console.error(error.message)
     
    }
 }
