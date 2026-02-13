
/**
 * API auth LAYER
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

const login = async (email, password) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
    })
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const register = async (username,email, password) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username,
        email,
        password
    })
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const getProfile = async () => {
    try {
    const response = await axiosInstance.post(API_PATHS.AUTH.GET_PROFILE)
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const updateProfile = async (userData) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AUTH.UPDATE_PROFILE, {
       userData
    })
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const changePassword = async (passwords) => {
    try {
    const response = await axiosInstance.post(API_PATHS.AUTH.CHANGE_PASSWORD, {
        passwords
    })
    return response.data
    }catch(err){
        throw err.response?.data || {message: 'An unknown error occured'}
    }
}

const authService = {
    login,
    register,
    getProfile,
    updateProfile,
    changePassword
}

export default authService

