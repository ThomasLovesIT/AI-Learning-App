import React from "react";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 -mb-px overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`
                group relative whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 outline-none
                ${
                  activeTab === tab.name
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="relative z-10">{tab.label}</span>
              
              {/* Conditional rendering for extra styling effects if needed */}
              {activeTab === tab.name && (
                <div className="absolute inset-0 bg-blue-50/50 -z-0 rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;