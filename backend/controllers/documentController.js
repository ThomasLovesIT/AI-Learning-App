import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'
import Flashcard from '../models/Flashcard.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import  {chunckText} from '../models/textChunker.js'
import fs from 'fs/promises'
import mogoose from 'mongoose'


export const uploadDocument = async (req, res, next) => {
    try{
        const documentdetails = req.body

        if(!documentdetails){
            return res.status(400).json({message: 'Document cannot be empty'})
        }

        const document = await Document.create({
            documentdetails
        })


    }catch(error){
        if (req.file){
            await fs.unlink(req.file.path).catch(() => {})
        }
        next(error)
    }
}

export const getDocuments = async (req, res, next) => {

    try{

    }catch(error){

    }
}

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

