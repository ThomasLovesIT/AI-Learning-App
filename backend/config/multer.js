import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// 1. Setup Path Resolution (Standard for ES Modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 2. Define the absolute path to the directory
const uploadDir = path.join(__dirname, '../uploads/documents')

// 3. Ensure directory exists (Runs once at startup)
if (!fs.existsSync(uploadDir)) {
        //if it dosent exist, then make one room
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 4. Configure Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb = callback(error, destination)
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        // Create a collision-resistant filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname); // Extract .pdf
        
        // Example result: 172345678-555555-myFile.pdf
        cb(null, `${uniqueSuffix}-${file.originalname}`); 
    }
})

// 5. File Validation Logic
const fileFilter = (req, file, cb) => {
    // We check the MIME type (Internet media type), not just the extension
    if (file.mimetype === 'application/pdf') {
        cb(null, true) // Accept file
    } else {
        // Reject file with a descriptive error
        cb(new Error('Invalid file type. Only PDF is allowed.'), false) 
    }
}

// 6. Initialize Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        // readable limit: 10 MB in bytes
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 
    }
})

export default upload