import mongoose from 'mongoose'

const flashcardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required:true
    },
    cards: [
        {
            question: {type: String, Required: true},
            answer: {type: String, Required: true},
            difficulty: {type: String, enum: ['easy', 'medium','hard'], default: 'medium'},
            lastReviewed: {type: Date, Required: true},
            reviewCount: {type: Number, default: 0},
            isStarred: {type: Boolean, default: false }
        }
    ]
},{
    timestamps: true
}
)
//faster query
flashcardSchema.index({userId: 1, documenId: 1})

const Flashcard = mongoose.model('Flashcard', flashcardSchema )

export default Flashcard;