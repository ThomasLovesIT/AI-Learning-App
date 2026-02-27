import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import  quizService  from '../../services/quizService';
import Spinner from '../../components/common/Spinner';

const QuizTakePage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionIndex: selectedOptionString }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizService.getQuizById(quizId);
        if (res.data.completedAt) {
          toast.success("You already completed this quiz!");
          navigate(`/quizzes/${quizId}/results`);
        } else {
          setQuiz(res.data);
        }
      } catch (err) {
        toast.error("Failed to load quiz.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Format answers exactly as your backend expects
    const formattedAnswers = Object.keys(answers).map(index => ({
      questionIndex: parseInt(index),
      selectedAnswer: answers[index]
    }));

    if (formattedAnswers.length < quiz.questions.length) {
      if (!window.confirm("You haven't answered all questions. Submit anyway?")) return;
    }

    setSubmitting(true);
    try {
      await quizService.submitQuiz(quizId, formattedAnswers);
      toast.success("Quiz submitted!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (err) {
      toast.error(err.message || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;
  if (!quiz) return null;
 
  const currentQuestion = quiz.questions[currentIndex];
  const progressPercentage = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {/* Header & Progress */}
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to Document
          </button>
          
          <div className="flex justify-between items-end mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{quiz.title || 'Quiz'}</h1>
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} of {quiz.questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6">
          <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = answers[currentIndex] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700' 
                      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && <CheckCircle size={20} className="text-blue-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-6 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70"
            >
              {submitting ? <Spinner size="sm" color="white" /> : <CheckCircle size={18} />}
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 shadow-sm transition-colors"
            >
              Next <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTakePage;