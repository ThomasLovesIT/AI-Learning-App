import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 -ml-2 mr-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1"></div>

        <div className="flex items-center">
          <button className="relative p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200">
            <Bell size={20} strokeWidth={2} className="" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-gray-100 ml-4 sm:ml-6">
        <div className="relative">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-50">
            <User size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-medium text-gray-700">
            {user?.username || "User"}
          </p>
          <p className="text-xs text-gray-500">
            {user?.email || "student@example.com"}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;