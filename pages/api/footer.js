import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/', // Save uploaded files to public/uploads
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`); // Create unique filenames using timestamp
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

// Helper function to run Multer middleware
const runMulterMiddleware = (req, res, middleware) => {
  return new Promise((resolve, reject) => {
    middleware(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      resolve(result);
    });
  });
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // GET request - Fetch footer settings
  if (req.method === 'GET') {
    try {
      const footerSettings = await db.collection('footer').findOne({});
      if (!footerSettings) {
        return res.status(404).json({ message: 'Footer settings not found' });
      }
      return res.status(200).json(footerSettings);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching footer settings', error: error.message });
    }
  }

  // POST request - Save new footer settings
  if (req.method === 'POST') {
    try {
      await runMulterMiddleware(req, res, upload.single('logo')); // Handle file upload

      const { socialLinks, featuredLinks, quickLinks, contactInfo, copyrightText } = req.body;
      const logoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.logoUrl; // Handle logo file

      const footerData = {
        logoUrl,
        socialLinks: JSON.parse(socialLinks || '[]'),
        featuredLinks: JSON.parse(featuredLinks || '[]'),
        quickLinks: JSON.parse(quickLinks || '[]'),
        contactInfo: JSON.parse(contactInfo || '{}'),
        copyrightText: copyrightText || '',
      };

      await db.collection('footer').insertOne(footerData);
      return res.status(201).json({ message: 'Footer created successfully', footerData });
    } catch (error) {
      return res.status(500).json({ message: 'Error saving footer data', error: error.message });
    }
  }

  // PUT request - Update existing footer settings
  if (req.method === 'PUT') {
    try {
      await runMulterMiddleware(req, res, upload.single('logo')); // Handle file upload

      const { socialLinks, featuredLinks, quickLinks, contactInfo, copyrightText } = req.body;
      const logoUrl = req.file ? `/uploads/${req.file.filename}` : req.body.logoUrl; // Handle logo file

      const updatedFooterData = {
        logoUrl,
        socialLinks: JSON.parse(socialLinks || '[]'),
        featuredLinks: JSON.parse(featuredLinks || '[]'),
        quickLinks: JSON.parse(quickLinks || '[]'),
        contactInfo: JSON.parse(contactInfo || '{}'),
        copyrightText: copyrightText || '',
      };

      await db.collection('footer').updateOne({}, { $set: updatedFooterData }, { upsert: true });
      return res.status(200).json({ message: 'Footer updated successfully', updatedFooterData });
    } catch (error) {
      return res.status(500).json({ message: 'Error updating footer data', error: error.message });
    }
  }

  // Fallback for unsupported methods
  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}
