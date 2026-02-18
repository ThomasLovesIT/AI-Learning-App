import React from "react";
import { useParams, Link } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";

const QuizResultPage = () => {
  const { quizzId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Quiz results
          </h1>
          <p className="mt-1 text-gray-600">
            Quiz ID: <span className="font-medium text-gray-800">{quizzId}</span>
          </p>
        </div>
        <Link
          to={`/quizzes/${quizzId}`}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-100 hover:bg-gray-100 transition"
        >
          Back to quiz
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center ring-1 ring-blue-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Results</p>
            <p className="text-base font-semibold text-gray-900">
              Quiz results view (placeholder)
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Next step: fetch the submission results and show score + review.
        </p>
      </div>
    </div>
  );
};

export default QuizResultPage;

