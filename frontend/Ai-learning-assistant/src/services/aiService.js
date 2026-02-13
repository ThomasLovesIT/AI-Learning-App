
/**
 * API SERVICE LAYER
 * 
 * Purpose:
 * This file acts as the "bridge" between the Frontend UI (React Components) and the Backend API.
 * 
 * Design Pattern:
 * 1. Abstraction: UI components should not handle HTTP details (URLs, Headers, Axios). 
 *    They should simply call a function like `aiService.chat()` and get data back.
 * 2. Centralization: All API logic is kept in one place. If an endpoint changes, 
 *    we fix it here, not in 50 different components.
 * 3. Error Normalization: This layer catches raw HTTP errors and formats them 
 *    into clean messages that the UI can easily display to the user.
 */
import axiosInstance from '../utils/axiosInstance.js'
import { API_PATHS } from '../utils/apiPath.js'





const generateFlashcards = async (documentId, options) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_FLASHCARDS, {documentId, ...options})
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}
const generateQuiz = async (documentId, options) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_QUIZ, {documentId, ...options}
    )
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}
const generateSummary = async (documentId) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.GENERATE_SUMMARY, {documentId}
    )
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}
const chat = async (documentId, message) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.A, {documentId, question: message}
    )
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}
const explainConcept = async (documentId, concept) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.EXPLAIN_CONCEPT, {documentId,concept}
    )
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}
const chatHistory = async (documentId) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AI.GET_CHAT_HISTORY, {documentId}
    )
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const aiService = {
    generateFlashcards,
    generateQuiz,
    generateSummary,
    chat,
    explainConcept,
    chatHistory
}

export default aiService
