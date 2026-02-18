import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'
import Flashcard from '../models/Flashcards.js'
import { extractTextFromPDF } from '../utils/pdfParser.js'
import { chunkText } from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'
import path from 'path'                          // ✅ add this
import { fileURLToPath } from 'url'   


const __filename = fileURLToPath(import.meta.url) // ✅ add this
const __dirname = path.dirname(__filename) 

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
        const baseUrl = `http://localhost:${process.env.PORT || 5000}`
        const fileUrL = `${baseUrl}/uploads/documents/${req.file.filename}`;

        const document = await Document.create({
            userId: req.user._id,
            title: title,
            fileName: req.file.originalname,
            filePath: fileUrL,
            fileSize: req.file.size,
            status: 'processing',
            lastAccessed: Date.now(),
            uploadDate: Date.now()
        });

        //process pdf in backround and uses a queue in production
        processPDF(document._id, req.file.path).catch(err => {
              console.error('PDF processing error', err)

        })

        res.status(201).json({
           data: document
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
         await Document.findByIdAndUpdate(documentId, {
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
      //create a variable and find the document using .findOne
      const document = await Document.findOne({
        _id: req.params.id,
        userId: req.user._id
      });

      //validation
     if(!document){
      return res.status(404).json({
        message: 'Document does not exist',
        statusCode: 404
      })
     }

      //Get total counts of the associated flashcards and quizzes with .countDocuments
     const [flashcardCount, quizCount] = await Promise.all([
            Flashcard.countDocuments({ documentId: document._id, userId: req.user._id }),
            Quiz.countDocuments({ documentId: document._id, userId: req.user._id })
        ]);



         // 4. UPDATE: Update timestamp
        document.lastAccessed = Date.now();
        await document.save();

        // 5. MERGE: Convert to plain JS object to append custom fields
        const documentData = document.toObject();
        documentData.flashcardCount = flashcardCount;
        documentData.quizCount = quizCount;

      //display a success message
        res.status(200).json({
        success:true,
        data: documentData
        })
    }catch(error){
     res.status(500).json({
        message:error.message||error
      })
  
       
    }
}

export const deleteDocument = async (req, res, next) => {
    try{
      //fetch the data document id from the model
      const document = await Document.findOne({
        _id: req.params.id,
        userId: req.user._id
      });
      // condition if the id does not exist
      if(!document){
        return res.status(400).json({message: 'Document does not exist'})
      } 

      const urlPath = new URL(document.filePath).pathname; // /uploads/documents/file.pdf
      const localPath = path.join(__dirname, '..', urlPath); // ✅ goes up from /controllers to /backend
      await fs.unlink(localPath).catch(() => {});

      //delete document
     await document.deleteOne()
    

      res.status(200).json({
        message:'Document deleted successfully',
        success: true
      })
    }catch(error){
      console.log(error.message)
 res.status(500).json({
        message:'Internal server error',
       error: error.message
      })

    }
}

