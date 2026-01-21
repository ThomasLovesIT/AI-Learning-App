import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/Auth/SignupPage.jsx'
import LoginPage from './pages/Auth/LoginPage.jsx'
import DashboardPage from './pages/Dashboard/DashboardPage.jsx'
import DocumentsListPage from './pages/Documents/DocumentsListPage'
import DocumentsDetailsPage from './pages/Documents/DocumentsDetailsPage'
import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage'
import FlashcardsPage from './pages/Flashcards/FlashcardsPage'
import QuizTakePage from './pages/Quizzes/QuizTakePage'
import QuizResultPage from './pages/Quizzes/QuizResultPage'
import ProfilePage from './pages/Profile/ProfilePage'
import ProtectedRoute from './components/auth/ProtectedRoute'


import  NotFoundPage from './pages/NotFoundPage.jsx'
const App = () => {
 
  const isAuthenticated = true
  const isLoading = false


  if(isLoading){
    return (
      <p>loading the page</p>
    )
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/' 
          element={isAuthenticated ? <Navigate to='/dashboard' replace /> : <Navigate to='/login' replace />}
        />
        <Route 
          path='/login' 
          element={<LoginPage />}
        />
        <Route 
          path='/signup' 
          element={<SignupPage />}
        />
       
       
      {/*   Protected Routes  */}
        <Route element={<ProtectedRoute />}>
        <Route path='/dashboard'  element={<DashboardPage />} />
        <Route path='/documents'  element={<DocumentsListPage />} />
        <Route path='/documents/:id'  element={<DocumentsDetailsPage />} />
        <Route path='/flashcards'  element={<FlashcardsListPage />} />
        <Route path='/documents/:id/flashcards'  element={<FlashcardsPage />} />
        <Route path='/quizzes/:quizzId'  element={<QuizTakePage />} />
        <Route path='/quizzes/:quizzId/results'  element={<QuizResultPage />} />
        <Route path='/profile'  element={<ProfilePage />} />
        </Route>




         <Route path='*' element={<NotFoundPage />}/>


      </Routes>
    </BrowserRouter>
  )
}

export default App