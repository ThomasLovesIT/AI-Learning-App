import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import flashcardService from "../../services/flashcardService.js";

const FlashcardsListPage = () => {
  const [loading, setLoading] = useState(true);
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchSets = async () => {
      setLoading(true);
      try {
        const res = await flashcardService.getAllFlashcardSets();
        setSets(res?.data ?? []);
      } catch (e) {
        toast.error(e?.message || "Failed to load flashcard sets");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Flashcards
          </h1>
          <p className="mt-1 text-gray-600">
            Review and manage your flashcard sets.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          Flashcards are generated from documents using AI.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        </div>
      ) : sets.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8">
          <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center ring-1 ring-purple-100">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No flashcard sets yet
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Generate flashcards from a document to start studying here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sets.map((set) => (
            <Link
              key={set._id}
              to={`/documents/${set.documentId?._id || set.documentId}/flashcards`}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-5 flex items-start gap-3 hover:border-blue-200 hover:shadow-md transition"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center ring-1 ring-purple-100">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                  {set.documentId?.title || "Untitled document"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">
                  {set.documentId?.fileName}
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Cards: {Array.isArray(set.cards) ? set.cards.length : 0}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsListPage;

