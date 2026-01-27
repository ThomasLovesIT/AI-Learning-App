import Flashcard from '../models/Flashcards.js'

export const getFlashcards = async (req, res, next) => {
  try { 
    const flashcards = await Flashcard.find({
      userId: req.user._id,
      documentId: req.params.documentId
    })
    .populate('documentId', 'title fileName')
    .sort({ createdAt: -1 })

    res.status(200).json({
      data: flashcards,
      count: flashcards.length,
      success: true,
      message: "flashcards shown successfully"
    })
  } catch (error) {
    next(error)
  }
}

export const getAllFlashcardsSets = async (req, res, next) => {
  try {
    const flashcardsSets = await Flashcard.find({
      userId: req.user._id,
    })
    .populate('documentId', 'title fileName')
    .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: flashcardsSets,
      count: flashcardsSets.length
    })
  } catch (error) {
    next(error)
  }
};

export const reviewFlashcard = async (req, res, next) => {
  try {
    const flashcard = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id
    });

    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard does not exist'
      });
    }

    const cardIndex = flashcard.cards.findIndex(
      card => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'card not found in set'
      })
    }

    flashcard.cards[cardIndex].lastReviewed = new Date()
    flashcard.cards[cardIndex].reviewCount += 1

    await flashcard.save()

    res.status(200).json({
      success: true,
      data: flashcard,
      message: 'flashcard reviewed successfully'
    });

  } catch (error) {
    next(error)
  }
};

export const toggleStarFlashcard = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
      userId: req.user._id
    });

    if (!flashcardSet) {
      return res.status(400).json({
        success: false,
        error: 'Flashcard not found'
      })
    }

    const cardIndex = flashcardSet.cards.findIndex(
      card => card._id.toString() === req.params.cardId
    );

    if (cardIndex === -1) {
      return res.status(400).json({
        success: false,
        error: 'card not found in set'
      })
    }

    flashcardSet.cards[cardIndex].isStarred =
      !flashcardSet.cards[cardIndex].isStarred

    await flashcardSet.save();

    res.status(200).json({
      success: true,
      data: flashcardSet,
      message: `Flashcard ${
        flashcardSet.cards[cardIndex].isStarred ? 'starred' : 'unstarred'
      }`
    })
  } catch (error) {
    next(error)
  }
}

export const deleteFlashcardSet = async (req, res, next) => {
  try {
    const flashcardSet = await Flashcard.findOne({
      'cards._id': req.params.cardId,
    });

    if (!flashcardSet) {
      return res.status(400).json({
        message: 'Flashcard does not exist'
      })
    } 

    await flashcardSet.deleteOne()

    res.status(200).json({
      success: true, 
      message: 'Flashcard deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
