import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BrainCircuit, Sparkles, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import  quizService  from '../../services/quizService';
import aiService from '../../services/aiService';
import QuizCard from './QuizCard';
import Spinner from '../common/Spinner';

const QuizManager = () => {
  const { id: documentId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      // Make sure it says "getQuizzesByDocument" here to match your service!
      const res = await quizService.getQuizzesByDocument(documentId);
      


      // Safely handle both data shapes your backend might return
      let fetchedQuizzes = [];
      if (Array.isArray(res?.data)) {
        fetchedQuizzes = res.data;
      } else if (res?.data?.quizzes && Array.isArray(res.data.quizzes)) {
        fetchedQuizzes = res.data.quizzes;
      }

      setQuizzes(fetchedQuizzes);
    } catch (error) {
      console.error("Fetch Quizzes Error:", error);
      toast.error('Failed to load quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) fetchQuizzes();
  }, [documentId]);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!documentId) return;

    setIsGenerating(true);
    try {
      await aiService.generateQuiz(documentId, { numQuestions });
      toast.success('Quiz generated successfully!');
      fetchQuizzes(); // Refresh list
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to generate quiz.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await quizService.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(q => q._id !== quizId));
      toast.success('Quiz deleted');
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full max-h-[750px] overflow-y-auto custom-scrollbar pb-6 px-1">
      {/* GENERATE QUIZ SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-4 md:p-5 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800">AI Quiz Generator</h3>
            <p className="text-[11px] md:text-xs text-gray-500">Test your knowledge on this document</p>
          </div>
        </div>

        <div className="p-4 md:p-6">
          <form onSubmit={handleGenerateQuiz} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                disabled={isGenerating}
              >
                <option value={3}>3 Questions (Quick Test)</option>
                <option value={5}>5 Questions (Standard)</option>
                <option value={10}>10 Questions (Thorough)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm"
            >
              {isGenerating ? <Spinner size="sm" /> : <Sparkles size={16} />}
              {isGenerating ? 'Generating...' : 'Generate Quiz'}
            </button>
          </form>
        </div>
      </div>

      {/* QUIZ LIST SECTION */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-gray-800 px-1">Your Quizzes</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : quizzes.length > 0 ? (
          <div className="flex flex-col gap-3">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteQuiz} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center opacity-70">
            <BookOpen size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No quizzes generated yet.</p>
            <p className="text-gray-400 text-xs mt-1">Generate your first quiz above to start studying!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;