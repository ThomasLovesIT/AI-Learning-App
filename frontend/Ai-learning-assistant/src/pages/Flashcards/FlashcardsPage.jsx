import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";

const FlashcardsPage = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Flashcards
          </h1>
          <p className="mt-1 text-gray-600">
            Flashcards for document{" "}
            <span className="font-medium text-gray-800">{id}</span>
          </p>
        </div>
        <Link
          to="/flashcards"
          className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 ring-1 ring-gray-100 hover:bg-gray-100 transition"
        >
          Back to sets
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center ring-1 ring-purple-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Study</p>
            <p className="text-base font-semibold text-gray-900">
              Flashcards viewer (placeholder)
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Next step: render the generated flashcards for this document and
          support review actions.
        </p>
      </div>
    </div>
  );
};

export default FlashcardsPage;

