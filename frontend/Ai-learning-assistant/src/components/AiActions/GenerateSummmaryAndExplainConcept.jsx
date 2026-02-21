import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Lightbulb, Sparkles, Send, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import aiService from '../../services/aiService';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer';

const GenerateSummaryAndExplainConcept = () => {
  const { id: documentId } = useParams();

  // State for Summary
  const [summary, setSummary] = useState(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // State for Explain Concept
  const [conceptInput, setConceptInput] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);

  // Handler for Generating Summary
  const handleGenerateSummary = async () => {
    if (!documentId) return;
    
    setIsGeneratingSummary(true);
    try {
      const response = await aiService.generateSummary(documentId);
      
      // FIX: Correctly targeting the backend structure: response.data.summary
      const summaryText = response?.data?.summary;
      
      if (!summaryText) throw new Error("No summary text received from AI.");
      
      setSummary(summaryText);
      toast.success('Summary generated successfully!');
    } catch (error) {
      console.error('Failed to generate summary', error);
      toast.error(error.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Handler for Explaining Concept
  const handleExplainConcept = async (e) => {
    e.preventDefault();
    if (!documentId || !conceptInput.trim() || isExplaining) return;

    setIsExplaining(true);
    try {
      const response = await aiService.explainConcept(documentId, conceptInput);
      
      // FIX: Correctly targeting the backend structure: response.data.conceptExplanation
      const explanationText = response?.data?.conceptExplanation;
      
      if (!explanationText) throw new Error("No explanation text received from AI.");

      setExplanation({ concept: conceptInput, text: explanationText });
      setConceptInput('');
      toast.success('Concept explained!');
    } catch (error) {
      console.error('Failed to explain concept', error);
      toast.error(error.message || 'Failed to explain concept. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full max-h-[750px] overflow-y-auto custom-scrollbar pb-6 px-1">
      
      {/* 1. GENERATE SUMMARY SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-4 md:p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Document Summary</h3>
              <p className="text-[11px] md:text-xs text-gray-500">Get a quick overview of the entire document</p>
            </div>
          </div>
          {!summary && !isGeneratingSummary && (
            <button
              onClick={handleGenerateSummary}
              className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shrink-0"
            >
              <Sparkles size={16} />
              <span className="hidden md:inline">Generate Summary</span>
              <span className="md:hidden">Generate</span>
            </button>
          )}
        </div>

        <div className="p-4 md:p-6 max-h-[350px] overflow-y-auto custom-scrollbar">
          {isGeneratingSummary ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Spinner />
              <p className="text-sm text-gray-500 animate-pulse text-center">Reading document and generating summary...</p>
            </div>
          ) : summary ? (
            <div className="prose prose-sm max-w-none prose-blue">
              <MarkdownRenderer content={summary} />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateSummary}
                  className="text-xs text-blue-600 font-medium hover:underline flex items-center gap-1"
                >
                  <Sparkles size={12} /> Re-generate Summary
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
              <BookOpen size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 max-w-sm text-sm">
                No summary generated yet. Click the button above to let AI analyze and condense this document for you.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 2. EXPLAIN A CONCEPT SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-4 md:p-5 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <Lightbulb size={20} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-gray-800">Explain a Concept</h3>
            <p className="text-[11px] md:text-xs text-gray-500">Stuck on a specific term or idea? Let AI break it down.</p>
          </div>
        </div>

        <div className="p-4 md:p-6 flex flex-col gap-6">
          <form onSubmit={handleExplainConcept} className="relative w-full">
            <input
              type="text"
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              placeholder="e.g., 'Quantum Entanglement'..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
              disabled={isExplaining}
            />
            <button
              type="submit"
              disabled={!conceptInput.trim() || isExplaining}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {isExplaining ? (
              <div className="flex flex-col items-center justify-center py-8 space-y-4 border border-gray-100 rounded-xl bg-gray-50/50">
                <div className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                <p className="text-sm text-gray-500">Formulating explanation...</p>
              </div>
            ) : explanation ? (
              <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-4 md:p-5">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                  <Sparkles size={16} className="text-purple-600 shrink-0"/> 
                  Concept: {explanation.concept}
                </h4>
                <div className="prose prose-sm max-w-none prose-purple text-gray-700">
                  <MarkdownRenderer content={explanation.text} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

    </div>
  );
};

export default GenerateSummaryAndExplainConcept;