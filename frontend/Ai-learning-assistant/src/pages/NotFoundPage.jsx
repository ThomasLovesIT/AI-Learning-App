import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 p-10 text-center">
        <p className="text-sm font-medium text-gray-500">404</p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-2 text-gray-600">
          The page you’re looking for doesn’t exist or was moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          Go home
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

