import React from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, ArrowRight } from "lucide-react";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Profile
          </h1>
          <p className="mt-1 text-gray-600">Manage your account details.</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 ring-1 ring-red-100 hover:bg-red-100 transition"
        >
          Logout
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-200 flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-semibold text-gray-900 truncate">
              {user?.username || "User"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4" />
              <p className="text-xs">Email</p>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900 truncate">
              {user?.email || "student@example.com"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 ring-1 ring-gray-100 p-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-4 h-4" />
              <p className="text-xs">Account created at</p>
            </div>
            <p className="mt-1 text-sm font-medium text-gray-900 truncate">
              {user?.createdAt || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

