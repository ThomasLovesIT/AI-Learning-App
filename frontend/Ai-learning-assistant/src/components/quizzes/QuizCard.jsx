import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, Clock, Trash2, ArrowRight } from 'lucide-react';
import moment from 'moment';

const QuizCard = ({ quiz, onDelete }) => {
  const navigate = useNavigate();
  const isCompleted = !!quiz.completedAt;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg shrink-0 ${isCompleted ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          {isCompleted ? <CheckCircle size={24} /> : <Brain size={24} />}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800 text-base">
            {quiz.title || 'AI Generated Quiz'}
          </h4>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock size={12} /> {moment(quiz.createdAt).fromNow()}
            </span>
            <span>•</span>
            <span>{quiz.totalQuestions || quiz.questions?.length} Questions</span>
            {isCompleted && (
              <>
                <span>•</span>
                <span className={`font-medium ${quiz.score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
                  Score: {quiz.score}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={() => onDelete(quiz._id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Quiz"
        >
          <Trash2 size={18} />
        </button>
        
        {isCompleted ? (
          <button
            onClick={() => navigate(`/quizzes/${quiz._id}/results`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium rounded-lg transition-colors"
          >
            View Results <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => navigate(`/quizzes/${quiz._id}/take`)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            Take Quiz <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizCard;