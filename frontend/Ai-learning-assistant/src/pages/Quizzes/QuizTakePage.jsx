import React from "react";
import { useParams, Link } from "react-router-dom";
import { BrainCircuit, ArrowRight } from "lucide-react";

const QuizTakePage = () => {
  const { quizzId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quiz</h1>
          <p className="mt-1 text-gray-600">
            Quiz ID: <span className="font-medium text-gray-800">{quizzId}</span>
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-100 hover:bg-gray-100 transition"
        >
          Back to dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Take quiz</p>
            <p className="text-base font-semibold text-gray-900">
              Quiz runner (placeholder)
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Next step: load quiz questions from the quiz API and implement submit.
        </p>
      </div>
    </div>
  );
};

export default QuizTakePage;

