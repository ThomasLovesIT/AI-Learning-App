import React, { useState } from 'react';
import { Star } from 'lucide-react';

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Safely handle different backend property names (front/back vs question/answer)
  const frontText = flashcard.front || flashcard.question || 'No question provided';
  const backText = flashcard.back || flashcard.answer || 'No answer provided';
  const isStarred = flashcard.isStarred || false;

  return (
    <div 
      className="group h-[350px] w-full max-w-2xl mx-auto cursor-pointer perspective-1000"
      style={{ perspective: '1000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative h-full w-full transition-transform duration-500 ease-in-out`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* FRONT FACE */}
        <div 
          className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Star Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Prevents the card from flipping when clicking the star
              onToggleStar(flashcard._id);
            }}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
              isStarred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Star size={20} fill={isStarred ? 'currentColor' : 'none'} />
          </button>
          
          <span className="text-xs font-semibold text-blue-500 tracking-wider uppercase mb-4 absolute top-6 left-6">
            Question
          </span>
          <h3 className="text-xl md:text-2xl font-medium text-gray-800 leading-relaxed">
            {frontText}
          </h3>
          <p className="text-xs text-gray-400 absolute bottom-6">Click to reveal answer</p>
        </div>

        {/* BACK FACE */}
        <div 
          className="absolute inset-0 bg-blue-50/80 rounded-2xl shadow-sm border border-blue-200 p-8 flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase mb-4 absolute top-6 left-6">
            Answer
          </span>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed overflow-y-auto custom-scrollbar max-h-[220px]">
            {backText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;