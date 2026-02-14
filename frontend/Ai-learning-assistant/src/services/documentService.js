
/**
 * API document LAYER
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





const getDocuments = async () => {
    try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.GET_DOCUMENTS)
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'Failed to fetch all documents'}
    }
}
const uploadDocuments = async (formData) => {
    try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.UPLOAD, formData, {
        header: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'Failed to upload a document'}
    }
}
const getDocumentById = async (id) => {
    try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.GET_DOCUMENT_BY_ID(id))
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'Failed to fetch document detail'}
    }
}
const deleteDocument = async (id) => {
    try {
    const response = await axiosInstance.post(API_PATHS.DOCUMENTS.DELETE_DOCUMENT(id))
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'Failed to delete document'}
    }
}



const documentService = {
   getDocuments,
   uploadDocuments,
   deleteDocument,
  getDocumentById
}

export default documentService
