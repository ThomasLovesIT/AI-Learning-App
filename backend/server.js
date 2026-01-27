import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import errorHandler from './middleware/errorHandler.js'
import connectDB from './config/db.js'
//routes
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'

//ES_6 module dirname alternative
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


//initialize express app
const app = express()

// connect mongo db from config/db.js
connectDB()

app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT','DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);


app.use(express.json())
app.use(express.urlencoded({extended:true}))


//select a folder for the uploads
app.use('/uploads', express.static(path.join(__dirname,'uploads')))

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/document', documentRoutes)
app.use('/api/flashcard', flashcardRoutes)

// 404 Handler
app.use((req,res)=> {
    res.status(404).json({
        success:false,
        error: 'Route not found',
        statusCode: 404
    })
})

//start server

const PORT = process.env.port || 5000
app.listen(PORT, () => {
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
});

process.on('unhandledRejection', (err) => {
    console.error(`error: ${err.message}`)
    process.exit(1)

})