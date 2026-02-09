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
        const quiz = await Quiz.findOne({
         _id: req.params.id,
         userId: req.user._id
        })
        if(!quiz){
            return res.status(400).json({
                success:false,
                message:'Quiz not found',
                statusCode: 400
            })
        }
        console.log(quiz)

        res.status(200).json({
            success:true,
            message:'Quiz fetched by ID success',
            data: quiz
        })
     
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