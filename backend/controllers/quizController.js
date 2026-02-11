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
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid answers format',
        statusCode: 400
      });
    }

    // 1. Find quiz owned by user
    const quiz = await Quiz.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found',
        statusCode: 404
      });
    }

    // 2. Prevent double submission
    if (quiz.completedAt) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed',
        statusCode: 400
      });
    }

    // 3. Process answers
    let correctCount = 0;
    const userAnswers = [];

    answers.forEach(({ questionIndex, selectedAnswer }) => {
      // validate index
      if (
        typeof questionIndex !== 'number' ||
        questionIndex < 0 ||
        questionIndex >= quiz.questions.length
      ) {
        return;
      }

      const question = quiz.questions[questionIndex];
      const isCorrect = selectedAnswer === question.correctAnswer;

      if (isCorrect) correctCount++;

      userAnswers.push({
        questionIndex,
        selectedAnswer,
        isCorrect,
        answeredAt: new Date()
      });
    });

    // 4. Calculate score (percentage)
    const score = Math.round(
      (correctCount / quiz.totalQuestions) * 100
    );

    // 5. Save results
    quiz.userAnswers = userAnswers;
    quiz.score = score;
    quiz.completedAt = new Date();

    await quiz.save();

    // 6. Respond
    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        quizId: quiz._id,
        score,
        correctCount,
        totalQuestions: quiz.totalQuestions,
        percentage: score,
        userAnswers
      }
    });

  } catch (err) {
    next(err);
  }
};

 export const getQuizResults = async (req, res, next) => {
    try{
         const quiz = await Quiz.findOne({
          _id: req.params._id,
          userId: req.user._id
         }).populate('documentId', 'title');
         if(!quiz){
          return res.status(404).json({
             success:false,
                message:'Quiz not found',
                statusCode: 404
          })
         }
         // find the quiz where the "completedAt: true"
         if(!quiz.completedAt){
          return res.status(400).json({
             success:false,
                message:'Quiz not complete',
                statusCode: 400
          })
         }
         //display the score and total questions
         const detailedResults =  quiz.questions.map((question,index) => {
          const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index)

          return {
            questionIndex: index,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            selectedAnswer: userAnswer?.selectedAnswer || null,
            isCorrect: userAnswer?.isCorrect || false,
            explanation: question.explanation
         }
         })

          res.status(200).json({
        success: true,
        message: 'Quiz Results success',
        quizDetails: {
          id: quiz._id,
          title: quiz.title,
          document: quiz.documentId,
          score: quiz.score,
          totalQuestions: quiz.totalQuestions,
          completedAt: quiz.completedAt
        },
        results: detailedResults   
    });
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