import React, { useState, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2, ArrowLeft, Sparkles, Brain, Layers } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

import flashcardService from "../../services/flashcardService";
import aiService from "../../services/aiService";
import Spinner from "../common/Spinner";
import Flashcard from "./Flashcard";

// Note: If you have a custom Modal component, you can wrap the delete confirmation in it.
// For simplicity and immediate functionality without breaking, I've used standard UI rendering.

const FlashcardManager = ({ documentId }) => {
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState(null);

  // Fetch existing sets for this document
  const fetchFlashcardSets = async () => {
    if (!documentId) return;
    setLoading(true);
    try {
      // FIX: Changed from aiService.generateFlashcards to flashcardService.getFlashcardsByDocument
      const response = await flashcardService.getFlashcardsByDocument(documentId);
      // Fallback to empty array if data isn't directly the array
      setFlashcardSets(response.data || response || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch flashcard sets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();
  }, [documentId]);

  // Generate new flashcards via AI
  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      await aiService.generateFlashcards(documentId, { quantity: 10 }); // passing options if supported
      toast.success('Flashcards generated successfully!');
      fetchFlashcardSets(); // Re-fetch list to include the newly generated set
    } catch (error) {
      toast.error(error.message || 'Failed to generate flashcards');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectSet = (set) => {
    setSelectedSet(set);
    setCurrentCardIndex(0);
  };

  // Pagination & Review Logic
  const handleNextCard = () => {
    if (selectedSet && selectedSet.cards?.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % selectedSet.cards.length);
    }
  };
  
  const handlePrevCard = () => {
    if (selectedSet && selectedSet.cards?.length > 0) {
      handleReview(currentCardIndex);
      setCurrentCardIndex((prevIndex) => 
        (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };
  
  const handleReview = async (index) => {
    const currentCard = selectedSet?.cards?.[index];
    if (!currentCard || !currentCard._id) return;
  
    try {
      await flashcardService.reviewFlashcard(currentCard._id, index);
    } catch (error) {
      console.warn('Failed to sync review status:', error.message);
      // Note: intentionally not showing error toast here so it doesn't interrupt studying
    }
  };

  const handleToggleStar = async (cardId) => {
    try {
      await flashcardService.toggleFlashcardStar(cardId);
      
      // Optimistically update the UI so the user sees the star instantly
      if (selectedSet) {
        const updatedCards = selectedSet.cards.map(card => 
          card._id === cardId ? { ...card, isStarred: !card.isStarred } : card
        );
        setSelectedSet({ ...selectedSet, cards: updatedCards });
      }
    } catch (error) {
      toast.error('Failed to update star status');
    }
  };

  // Delete Flow
  const handleDeleteRequest = (e, set) => {
    e.stopPropagation(); // FIX: Typo corrected
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!setToDelete?._id) return;
    
    setDeleting(true);
    try {
      await flashcardService.deleteFlashcardSet(setToDelete._id);
      toast.success('Flashcard Set Deleted');
      
      // Remove from local state
      setFlashcardSets(prev => prev.filter(s => s._id !== setToDelete._id));
      setIsDeleteModalOpen(false);
      setSetToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete flashcards');
    } finally {
      setDeleting(false);
    }
  };

  // VIEW 1: Viewer Mode (Studying Flashcards)
  const renderFlashcardViewer = () => {
    if (!selectedSet || !selectedSet.cards || selectedSet.cards.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-gray-500">No cards found in this set.</p>
          <button onClick={() => setSelectedSet(null)} className="mt-4 text-blue-600 font-medium">
            Go Back
          </button>
        </div>
      );
    }

    const totalCards = selectedSet.cards.length;

    return (
      <div className="flex flex-col h-full bg-gray-50/30 rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setSelectedSet(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Back to Sets</span>
          </button>
          
          <div className="flex flex-col items-end">
             <span className="text-sm font-semibold text-gray-800">
                {selectedSet.title || "Study Set"}
             </span>
             <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200 mt-1 shadow-sm">
               Card {currentCardIndex + 1} of {totalCards}
             </span>
          </div>
        </div>

        {/* The Card */}
        <div className="flex-1 flex items-center justify-center w-full px-4 mb-8">
          <Flashcard 
            flashcard={selectedSet.cards[currentCardIndex]} 
            onToggleStar={handleToggleStar} 
          />
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mt-auto">
          <button 
            onClick={handlePrevCard}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300" 
              style={{ width: `${((currentCardIndex + 1) / totalCards) * 100}%` }}
            />
          </div>

          <button 
            onClick={handleNextCard}
            className="p-3 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  };

  // VIEW 2: Default view (List of Flashcard Sets)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] border border-gray-100 rounded-2xl shadow-sm bg-white">
        <Spinner />
        <p className="mt-4 text-gray-500 font-medium">Loading flashcards...</p>
      </div>
    );
  }

  // If a set is selected, show the Viewer
  if (selectedSet) {
    return renderFlashcardViewer();
  }

  return (
    <div className="flex flex-col gap-6 h-full max-h-[750px] overflow-y-auto custom-scrollbar pb-6 px-1">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col shrink-0">
        <div className="p-4 md:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800">Flashcard Sets</h3>
              <p className="text-[11px] md:text-xs text-gray-500">Test your knowledge with AI generated cards</p>
            </div>
          </div>
          
          <button
            onClick={handleGenerateFlashcards}
            disabled={generating}
            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white text-xs md:text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-70 transition-colors shadow-sm shrink-0"
          >
            {generating ? <Spinner size="sm" color="white" /> : <Sparkles size={16} />}
            <span className="hidden md:inline">{generating ? 'Generating...' : 'Generate New Flashcards'}</span>
            <span className="md:hidden">Generate</span>
          </button>
        </div>
      </div>

      {/* LIST OF SETS */}
      {flashcardSets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center opacity-70 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Layers size={48} className="text-gray-300 mb-4" />
          <h4 className="text-lg font-semibold text-gray-700">No Flashcards Yet</h4>
          <p className="text-gray-500 max-w-sm text-sm mt-2 mb-6">
            Generate your first set of AI flashcards to start memorizing key concepts from this document.
          </p>
          <button
             onClick={handleGenerateFlashcards}
             className="text-blue-600 font-medium bg-blue-50 px-6 py-2 rounded-lg hover:bg-blue-100 transition-colors"
          >
             Generate Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {flashcardSets.map((set) => (
            <div 
              key={set._id}
              onClick={() => handleSelectSet(set)}
              className="bg-white border border-gray-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {set.title || "AI Generated Study Set"}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {moment(set.createdAt).format('MMMM Do YYYY')}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => handleDeleteRequest(e, set)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                  <Layers size={14} className="text-gray-400" />
                  {set.cards?.length || 0} Cards
                </div>
                
                <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  Study Now <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Basic Delete Confirmation Modal Logic */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Flashcard Set?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure you want to delete this set? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-70 transition-colors flex items-center gap-2"
              >
                {deleting && <Spinner size="sm" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FlashcardManager;