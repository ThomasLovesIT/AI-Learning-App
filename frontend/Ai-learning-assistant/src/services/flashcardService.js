/**
 * FLASHCARD SERVICE LAYER
 * 
 * Purpose:
 * Handles all HTTP requests related to flashcard management.
 * This file abstracts the API calls so components like 'StudyMode' or 'Dashboard'
 * don't need to know about Axios or specific URL endpoints.
 */

import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPath.js'

// Get all flashcard sets created by the user (e.g., for the dashboard)
const getAllFlashcardSets = async () => {
    try {
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_ALL_SETS)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch flashcard sets' }
    }
}

// Get specific flashcards for a document (e.g., when opening a study set)
const getFlashcardsByDocument = async (documentId) => {
    try {
        // We use the function defined in API_PATHS to generate the URL with the ID
        const response = await axiosInstance.get(API_PATHS.FLASHCARDS.GET_BY_DOCUMENT(documentId))
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to load flashcards' }
    }
}

// Submit a review for a specific card (e.g., rating it "Easy", "Hard")
const reviewFlashcard = async (cardId, cardIndex) => {
    try {
        const response = await axiosInstance.post(API_PATHS.FLASHCARDS.REVIEW_CARD(cardId), {cardIndex})
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to submit review' }
    }
}

// Toggle the "Star" or "Favorite" status of a card
const toggleFlashcardStar = async (cardId) => {
    try {
        const response = await axiosInstance.put(API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId))
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update card status' }
    }
}

// Delete an entire set of flashcards
const deleteFlashcardSet = async (id) => {
    try {
        const response = await axiosInstance.delete(API_PATHS.FLASHCARDS.DELETE_SET(id))
        return response.data
    
    } catch (err) {
        throw err.response?.data || { message: 'Failed to delete flashcard set' }
    }
}

const flashcardService = {
    getAllFlashcardSets,
    getFlashcardsByDocument,
    reviewFlashcard,
    toggleFlashcardStar,
    deleteFlashcardSet
}

export default flashcardService