import express from 'express'

import {
    getFlashcards,
    getAllFlashcardsSets,
    reviewFlashcard,
    toggleStartFlashcard,
    deleteFlashcardSet
} from '../controllers/flashcardController.js'
import protect from '../middleware/auth.js'


const router = express.Router()


//all routes are protected and requires auth
router.use(protect)


router.get('/', getAllFlashcardsSets )
router.get('/:documentId', getFlashcards )
router.post('/:cardId/review', reviewFlashcard )
router.put('/:cardId/star', toggleStartFlashcard )
router.delete('/:id', deleteFlashcardSet )


export default router