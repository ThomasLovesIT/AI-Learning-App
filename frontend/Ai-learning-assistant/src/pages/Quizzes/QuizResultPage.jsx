import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import MarkdownRenderer from '../../components/common/MarkdownRenderer';
import  quizService  from '../../services/quizService';
import Spinner from '../../components/common/Spinner';

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [results, setResults] = useState([]);


  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await quizService.getQuizResults(quizId);
        setDetails(res.quizDetails);
        setResults(res.results);
      } catch (err) {
        toast.error("Failed to load results.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [quizId, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Spinner /></div>;
  if (!details) return null;

  const isPass = details.score >= 70;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Navigation & Score Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 text-center relative overflow-hidden">
        <button 
     onClick={() => navigate(-1)}
      className="absolute top-6 left-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors z-10"
    >
      <ArrowLeft size={16} /> Back to Document
    </button>

          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-2">Quiz Results</h1>
          
          <div className="flex flex-col items-center justify-center my-6">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center border-8 ${isPass ? 'border-green-100 bg-green-50' : 'border-amber-100 bg-amber-50'}`}>
              <span className={`text-4xl md:text-5xl font-black ${isPass ? 'text-green-600' : 'text-amber-600'}`}>
                {details.score}%
              </span>
            </div>
            <p className="mt-4 text-gray-600 font-medium">
              You got {Math.round((details.score / 100) * details.totalQuestions)} out of {details.totalQuestions} correct
            </p>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-800 px-2">Detailed Review</h2>
          
          {results.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 md:p-6 border-b border-gray-50">
                <div className="flex gap-3 items-start">
                  <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                    {index + 1}
                  </span>
                  <h3 className="text-gray-800 font-medium text-base md:text-lg pt-1">
                    {item.question}
                  </h3>
                </div>
              </div>

              <div className="p-5 md:p-6 bg-gray-50/30 flex flex-col gap-3">
                {item.options.map((opt, oIdx) => {
                  const isCorrectAnswer = opt === item.correctAnswer;
                  const isUserSelection = opt === item.selectedAnswer;
                  
                  let optStyle = "border-gray-200 bg-white text-gray-600"; // default
                  let Icon = null;

                  if (isCorrectAnswer) {
                    optStyle = "border-green-500 bg-green-50 text-green-800 font-medium shadow-sm";
                    Icon = <Check size={18} className="text-green-600" />;
                  } else if (isUserSelection && !item.isCorrect) {
                    optStyle = "border-red-400 bg-red-50 text-red-800 font-medium";
                    Icon = <X size={18} className="text-red-500" />;
                  }

                  return (
                    <div key={oIdx} className={`p-4 rounded-xl border ${optStyle} flex justify-between items-center transition-all`}>
                      <span>{opt}</span>
                      {Icon && <span>{Icon}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Explanation Block */}
              {item.explanation && (
                <div className="bg-blue-50/50 p-5 border-t border-blue-100 flex gap-3">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg shrink-0 h-fit">
                    <Lightbulb size={18} />
                  </div>
                  <div className="text-sm text-gray-700 prose prose-sm max-w-none prose-blue">
                    <MarkdownRenderer content={`**Explanation:** ${item.explanation}`} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;