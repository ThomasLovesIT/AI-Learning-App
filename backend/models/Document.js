import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        trim: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    extractedText: {
        type: String,
        default: ''
    },
    chunks: [{
        content: {
            type:String,
            required:true
        },
        pageNumber: {
            type:Number,
            default:0
        },
        chunkIndex: {
            type:Number,
         required: true
        },
    }],
    uploadDate:{
        type: Date,
        required: true
    }, 
    lastAccessed:{
        type: Date,
        required: Date.now
    }, 
    status:{
        type: String,
        enum: ['processing', 'ready', 'failed'],
        default: 'processing'
    }, 
},{
    timestamps: true
})

//faster query
documentSchema.index({userId: 1, uploadDate: -1})

const Document = mongoose.model('Document', documentSchema)

export default Document