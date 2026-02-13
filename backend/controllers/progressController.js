import Document from '../models/Document.js'
import Quiz from '../models/Quiz.js'
import Flashcard from '../models/Flashcards.js'

export const getDashboard = async (req, res, next) => {
  try {
    // Get user id (from params or auth middleware)
    const userId = req.user._id

    // Totals
    const totalDocument = await Document.countDocuments({ userId })
    const totalFlashcardSets = await Flashcard.countDocuments({ userId })
    const totalQuiz = await Quiz.countDocuments({ userId })
    const completedQuiz = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null }
    })

    // Flashcard statistics
    const flashcardSets = await Flashcard.find({ userId })

    let totalFlashcards = 0
    let reviewedFlashcards = 0
    let starredFlashcards = 0

    flashcardSets.forEach(set => {
      if (set.cards && Array.isArray(set.cards)) {
        totalFlashcards += set.cards.length
        reviewedFlashcards += set.cards.filter(c => c.reviewCount > 0).length
        starredFlashcards += set.cards.filter(c => c.isStarred).length
      }
    })

    // Quiz statistics
    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null }
    })

    const averageScore =
      quizzes.length > 0
        ? Math.round(
            quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length
          )
        : 0

    // Recent activity
    const recentDocument = await Document.find({ userId })
      .sort({ lastAccessed: -1 })
      .limit(5)
      .select('title fileName lastAccessed status')

    const recentQuizzes = await Quiz.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5)
      .populate('documentId', 'title')
      .select('score totalQuestions completedAt documentId')

    // RESPONSE
    res.status(200).json({
      success: true,
      data: {
        totals: {
          documents: totalDocument,
          flashcardSets: totalFlashcardSets,
          quizzes: totalQuiz,
          completedQuizzes: completedQuiz
        },
        flashcards: {
          total: totalFlashcards,
          reviewed: reviewedFlashcards,
          starred: starredFlashcards
        },
        quizzes: {
          averageScore
        },
        recent: {
          documents: recentDocument,
          quizzes: recentQuizzes
        }
      }
    })
  } catch (error) {
    next(error)
  }
}
