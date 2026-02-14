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
        const url = API_PATHS.FLASHCARDS.GET_BY_DOCUMENT(documentId)
        const response = await axiosInstance.get(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to load flashcards' }
    }
}

// Submit a review for a specific card (e.g., rating it "Easy", "Hard")
const reviewFlashcard = async (cardId, rating) => {
    try {
        const url = API_PATHS.FLASHCARDS.REVIEW_CARD(cardId)
        // Sending the rating in the body (assuming backend expects { rating: ... })
        const response = await axiosInstance.post(url, { rating })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to submit review' }
    }
}

// Toggle the "Star" or "Favorite" status of a card
const toggleFlashcardStar = async (cardId) => {
    try {
        const url = API_PATHS.FLASHCARDS.TOGGLE_STAR(cardId)
        const response = await axiosInstance.put(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to update card status' }
    }
}

// Delete an entire set of flashcards
const deleteFlashcardSet = async (setId) => {
    try {
        const url = API_PATHS.FLASHCARDS.DELETE_SET(setId)
        const response = await axiosInstance.delete(url)
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