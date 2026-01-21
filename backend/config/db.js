import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config() // ✅ REQUIRED

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected successfully`)
        console.log({status: 'success'})
    } catch (error) {
        console.error('MongoDB connection Error:')
        console.error(error.message, error)
        process.exit(1)
    }
}

export default connectDB
