import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'
import Flashcard from '../models/Flashcards.js'
import {extractTextFromPDF} from '../utils/pdfParser.js'
import  {chunkText} from '../utils/textChunker.js'
import fs from 'fs/promises'
import mongoose from 'mongoose'


export const getFlashcards = async (req, res, next) => {

}




export const getAllFlashcardsSets = async (req, res, next) => {
 
};


               

export const reviewFlashcard = async (req, res, next) => {

}

export const toggleStartFlashcard = async (req, res, next) => {

}

export const deleteFlashcardSet = async (req, res, next) => {

}

