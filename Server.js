import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Setup for ES Modules (import) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, 'uploads');

// Ensure the upload directory exists
import fs from 'fs';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// --- Multer Configuration for File Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Files will be stored in the 'uploads' directory, which should be mapped 
    // to Zeabur's Persistent Disk for persistence.
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Create a unique filename: timestamp + original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- Middleware & Routes ---

// Serve static files from the root (where your frontend will live)
app.use(express.static(path.join(__dirname, 'public')));

// File Upload Endpoint
app.post('/api/upload', upload.single('imageFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Construct the publicly accessible URL
  const fileUrl = `/uploads/${req.file.filename}`;

  console.log(`File uploaded: ${req.file.filename}`);
  
  // Return the public URL for the client to use
  res.json({
    success: true,
    message: 'File uploaded successfully to Zeabur Persistent Disk.',
    url: fileUrl,
    fileName: req.file.filename
  });
});

// Serve the uploads folder publicly
app.use('/uploads', express.static(uploadDir));

// --- Server Startup ---
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Maps to http://localhost:${port} to view the app.`);
});