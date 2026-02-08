import Quiz from '../models/Quiz.js'

 export const getQuizzes = async (req, res, next) => {
    try{
        const quizzes =  await Quiz.find({
         userId: req.user._id,
           documentId: req.params.documentId
        })
        .populate('documentId','title')
        .sort({ createdAt: -1 })

        if(quizzes.length === 0){
            return res.status(200).json({
                success: true,
                    data: {
                    total: 0,
                    quizzes: []
                    },
                message: 'No quizzes found for this document'
        });
        }

        res.status(200).json({
            success:true,
            count: quizzes.length,
            data: quizzes,
            message: 'Quizzes fetched successfully'
        })
    }catch(err){
        next(err)
    }
 }

 export const getQuizById = async (req, res, next) => {
    try{

    }catch(err){
        next(err)
    }
 }
 export const submitQuiz = async (req, res, next) => {
    try{

    }catch(err){
        next(err)
    }
 }
 export const getQuizResults = async (req, res, next) => {
    try{

    }catch(err){
        next(err)
    }
 }
 export const deleteQuiz = async (req, res, next) => {
    try{

    }catch(err){
        next(err)
    }
 }