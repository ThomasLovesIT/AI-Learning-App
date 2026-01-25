import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'
import Flashcard from '../models/Flashcards.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import  {chunkText} from '../utils/textChunker.js'
import fs from 'fs/promises'
import mogoose from 'mongoose'


export const uploadDocument = async (req, res, next) => {
    try{
    
        if(!req.file){
            return res.status(400).json({
              success: false,
              message: 'Please upload a pdf',
              statusCode: 400
            })
         }


        const {title} = req.body
        if(!title){
             await fs.unlink(req.file.path)
               return res.status(400).json({error: 'Provide a pdf title'})
        }
        const baseUrl = `https://localhost:${process.env.PORT || 5000}`
        const fileUrL = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title: title,
            fileName: req.file.originalname,
            filePath: fileUrL,
            fileSize: req.file.size,
            status: 'processing'
        });

        //process pdf in backround and uses a queue in production
        processPDF(document._id, req.file.path).catch(err => {
              console.error('PDF processing error', err)

        })

        res.status(201).json({
            success:true,
            message:'PDF uploaded successfully, process in progress'
        })

    }catch(error){
        if (req.file){
            await fs.unlink(req.file.path).catch(() => {})
        }
        next(error)
    } 
}


//helper function to process PDF
const processPDF = async (documentId,filePath) => {
    try{
        const {text} = await extractTextFromPDF(filePath);


        //create chunk
        const chunks = chunkText(text,500,50)

        await Document.findByIdAndUpdate(documentId, {
            extractedText: text,
            chunks: chunks,
            status: 'ready'
        })

        console.log(`Document ${documentId} is ready`)
    }catch(err){
        console.log(err || err.message);
         await Document.findByIdAndUpdate(docuemntId, {
            status: 'failed'
        })

    }
}


export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: { 
          userId: new mongoose.Types.ObjectId(req.user._id) 
        }
      },
      {
        $lookup: {
          from: 'flashcards',
          localField: '_id',
          foreignField: 'documentId',
          as: 'flashcardSets'
        }
      },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: 'documentId',
          as: 'quizzes'
        } 
      },
      {
        $addFields: {
          flashcardCount: { $size: '$flashcardSets' },
          quizCount: { $size: '$quizzes' }
        }
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0
        }
      },
      {
        $sort: {
          uploadedDate: -1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      data: documents
    });

  } catch (err) {
    next(err); // or res.status(500).json({ message: err.message })
  }
};


               

export const getDocument = async (req, res, next) => {

    try{

    }catch(error){

    }
}

export const updateDocument = async (req, res, next) => {

    try{

    }catch(error){

    }
}

export const deleteDocument = async (req, res, next) => {

    try{

    }catch(error){

    }
}

