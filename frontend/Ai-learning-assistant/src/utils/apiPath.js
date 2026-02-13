/**
 * API CONSTANTS & ROUTES
 * 
 * Purpose:
 * This file acts as a central "address book" for all backend endpoints.
 * Instead of hardcoding URLs (e.g., "http://localhost:8000/api/...") inside components,
 * we import them from here. This makes refactoring easier if backend routes change.
 */

// The root URL of your backend server.
// TODO: Change this to your production URL when deploying (e.g., https://myapp.com)
export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register",
        GET_PROFILE: "/api/auth/profile",
        UPDATE_PROFILE: "/api/auth/profile",
        CHANGE_PASSWORD: "/api/auth/change-password",
    },

    DOCUMENTS: {
        // Based on your code: router.post('/', upload...)
        UPLOAD: "/api/documents", 
        GET_DOCUMENTS: "/api/documents",
        GET_DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
        DELETE_DOCUMENT: (id) => `/api/documents/${id}`,
    },

    AI: {
        GENERATE_FLASHCARDS: "/api/ai/generate-flashcards",
        GENERATE_QUIZ: "/api/ai/generate-quiz",
        GENERATE_SUMMARY: "/api/ai/generate-summary",
        CHAT: "/api/ai/chat",
        EXPLAIN_CONCEPT: "/api/ai/explain-concept",
        GET_CHAT_HISTORY: (documentId) => `/api/ai/chat-history/${documentId}`,
    },

    FLASHCARDS: {
        GET_ALL_SETS: "/api/flashcards",
        GET_BY_DOCUMENT: (documentId) => `/api/flashcards/${documentId}`,
        REVIEW_CARD: (cardId) => `/api/flashcards/${cardId}/review`,
        TOGGLE_STAR: (cardId) => `/api/flashcards/${cardId}/star`,
        DELETE_SET: (id) => `/api/flashcards/${id}`,
    },

    QUIZ: {
        GET_BY_DOCUMENT: (documentId) => `/api/quizzes/document/${documentId}`,
        GET_BY_ID: (id) => `/api/quizzes/${id}`,
        SUBMIT: (id) => `/api/quizzes/${id}/submit`,
        GET_RESULTS: (id) => `/api/quizzes/${id}/results`,
        DELETE_QUIZ: (id) => `/api/quizzes/${id}`,
    },

    PROGRESS: {
        DASHBOARD: "/api/progress/dashboard",
    }
};