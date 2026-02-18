import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  FileText,
  User,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: BrainCircuit },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/flashcards", label: "Flashcards", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close the mobile drawer after navigation.
  useEffect(() => {
    if (isSidebarOpen) toggleSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const closeIfOpen = () => {
    if (isSidebarOpen) toggleSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <button
          type="button"
          onClick={closeIfOpen}
          aria-label="Close sidebar"
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-72",
          "bg-white/90 backdrop-blur-md border-r border-gray-100",
          "shadow-xl shadow-gray-200/30 lg:shadow-none",
          "transform transition-transform duration-200 ease-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:flex lg:flex-col lg:shrink-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 shadow-md shadow-blue-200 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-gray-900">AI Learning</p>
            <p className="text-xs text-gray-500">Assistant</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeIfOpen}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-700",
                ].join(" ")
              }
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-white ring-1 ring-gray-100 group-hover:ring-blue-100 transition">
                <Icon className="w-5 h-5" />
              </span>
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 ring-1 ring-gray-100">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-200">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "student@example.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 ring-1 ring-gray-100 transition"
          >
            <ArrowRight className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
