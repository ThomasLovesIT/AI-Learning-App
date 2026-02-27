/**
 * QUIZ SERVICE LAYER
 */

import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPath.js'

// Get all quizzes associated with a specific document
const getQuizzesByDocument = async (documentId) => {
    try {
        // ADDED AWAIT HERE
        const response = await axiosInstance.get(API_PATHS.QUIZ.GET_BY_DOCUMENT(documentId)) 
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch quizzes for this document' }
    }
}

// Get a single quiz by its ID
const getQuizById = async (quizId) => {
    try {
        // ADDED AWAIT HERE
        const response = await axiosInstance.get(API_PATHS.QUIZ.GET_BY_ID(quizId)) 
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to load quiz details' }
    }
}

// Submit quiz answers to be graded
const submitQuiz = async (quizId, answers) => {
    try {
        // ADDED AWAIT HERE
        const response = await axiosInstance.post(API_PATHS.QUIZ.SUBMIT(quizId), {answers}) 
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to submit quiz' }
    }
}

// Get the results/score of a specific quiz attempt
const getQuizResults = async (quizId) => {
    try {
        // ADDED AWAIT HERE
        const response = await axiosInstance.get(API_PATHS.QUIZ.GET_RESULTS(quizId)) 
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to fetch quiz results' }
    }
}

// Delete a quiz
const deleteQuiz = async (quizId) => {
    try {
        // ADDED AWAIT HERE
        const response = await axiosInstance.delete(API_PATHS.QUIZ.DELETE_QUIZ(quizId)) 
        return response.data
    } catch (err) {
        throw err.response?.data || { message: 'Failed to delete quiz' }
    }
}

const quizService = {
    getQuizzesByDocument, // <-- NOTE THIS NAME
    getQuizById,
    submitQuiz,
    getQuizResults,
    deleteQuiz
}

export default quizService