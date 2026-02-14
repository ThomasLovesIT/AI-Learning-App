/**
 * QUIZ SERVICE LAYER
 * 
 * Purpose:
 * Centralizes all API interactions related to Quizzes.
 * This separates the UI logic (React components) from the data fetching logic (Axios/API).
 * It handles fetching quiz lists, submitting answers, and retrieving results.
 */

import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPath.js'

// Get all quizzes associated with a specific document
const getQuizzesByDocument = async (documentId) => {
    try {
        const url = API_PATHS.QUIZ.GET_BY_DOCUMENT(documentId)
        const response = await axiosInstance.get(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch quizzes for this document' }
    }
}

// Get a single quiz by its ID (e.g., when starting a quiz)
const getQuizById = async (quizId) => {
    try {
        const url = API_PATHS.QUIZ.GET_BY_ID(quizId)
        const response = await axiosInstance.get(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to load quiz details' }
    }
}

// Submit quiz answers to be graded
const submitQuiz = async (quizId, answers) => {
    try {
        const url = API_PATHS.QUIZ.SUBMIT(quizId)
        // Sending answers object to the backend
        const response = await axiosInstance.post(url, { answers })
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to submit quiz' }
    }
}

// Get the results/score of a specific quiz attempt
const getQuizResults = async (quizId) => {
    try {
        const url = API_PATHS.QUIZ.GET_RESULTS(quizId)
        const response = await axiosInstance.get(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch quiz results' }
    }
}

// Delete a quiz
const deleteQuiz = async (quizId) => {
    try {
        const url = API_PATHS.QUIZ.DELETE_QUIZ(quizId)
        const response = await axiosInstance.delete(url)
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to delete quiz' }
    }
}

const quizService = {
    getQuizzesByDocument,
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
}

export default quizService