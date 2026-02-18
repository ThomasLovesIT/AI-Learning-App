import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, BrainCircuit, FileText, TrendingUp } from "lucide-react";
import Spinner from "../../components/Spinner";
import progressService from "../../services/progressService.js";

const StatCard = ({ label, value, icon: Icon, gradient }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="p-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {typeof value === "number" ? value : "—"}
          </p>
        </div>
        <div
          className={[
            "w-12 h-12 rounded-2xl text-white shadow-md flex items-center justify-center",
            "bg-gradient-to-br",
            gradient,
          ].join(" ")}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="h-1.5 bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
    </div>
  );
};

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await progressService.getDashboard();
        setDashboardData(result?.data ?? result ?? null);
      } catch (error) {
        toast.error("Failed to fetch dashboard data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totals = dashboardData?.totals ?? {};
    return [
      {
        label: "Documents",
        value: totals.documents,
        icon: FileText,
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        label: "Flashcard sets",
        value: totals.flashcardSets,
        icon: BookOpen,
        gradient: "from-purple-500 to-pink-500",
      },
      {
        label: "Quizzes",
        value: totals.quizzes,
        icon: BrainCircuit,
        gradient: "from-emerald-500 to-teal-500",
      },
    ];
  }, [dashboardData]);

  if (loading) return <Spinner />;

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 max-w-sm text-center">
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 shadow-inner">
            <TrendingUp className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-xl font-semibold text-gray-700 mb-2">
            No dashboard data yet
          </p>
          <p className="text-gray-500">
            Upload a document to start generating flashcards and quizzes.
          </p>
        </div>
      </div>
    );
  }

  const flashcards = dashboardData?.flashcards ?? {};
  const quizzes = dashboardData?.quizzes ?? {};

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-600">
            Quick overview of your learning activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900">Flashcards</h2>
          <p className="text-sm text-gray-600 mt-1">
            Review progress across your cards.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {typeof flashcards.total === "number" ? flashcards.total : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
              <p className="text-xs text-gray-500">Reviewed</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {typeof flashcards.reviewed === "number"
                  ? flashcards.reviewed
                  : "—"}
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
              <p className="text-xs text-gray-500">Starred</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {typeof flashcards.starred === "number"
                  ? flashcards.starred
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900">Quizzes</h2>
          <p className="text-sm text-gray-600 mt-1">
            Your results and average performance.
          </p>

          <div className="mt-5 rounded-xl bg-gray-50 ring-1 ring-gray-100 p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Average score</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {typeof quizzes.averageScore === "number"
                  ? `${quizzes.averageScore}%`
                  : "—"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

