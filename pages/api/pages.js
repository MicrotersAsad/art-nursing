import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from "mongodb";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Disable built-in body parser for file upload handling by multer
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to let multer handle it
  },
};

// Set up multer storage and file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/uploads';

    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    // Generate unique filename based on timestamp
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to run multer middleware
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Helper function to parse JSON body manually
const parseJsonBody = async (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });
  });
};

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // Handle POST request - Create new page with image upload
  if (req.method === "POST") {
    // Run multer middleware to handle file upload
    try {
      await runMiddleware(req, res, upload.single('metaImage')); // 'metaImage' is the file field name
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }

    const { name, slug, content, metaTitle, metaDescription } = req.body;
    const metaImage = req.file ? `/uploads/${req.file.filename}` : null; // Get uploaded file path

    // Check for required fields
    if (!name || !slug || !content || !metaTitle || !metaDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure the slug is unique
    const existingPage = await db.collection("pages").findOne({ slug });
    if (existingPage) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    // Insert the new page into the database
    const result = await db.collection("pages").insertOne({
      name,
      slug,
      content,
      metaTitle,
      metaDescription,
      metaImage,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Page created", data: result });
  }

  // Handle GET request - Fetch all pages or a single page
  if (req.method === "GET") {
    const { slug } = req.query;

    if (slug) {
      // Fetch a single page based on slug
      const page = await db.collection("pages").findOne({ slug });
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      return res.status(200).json(page);
    }

    // Fetch all pages
    const pages = await db.collection("pages").find().toArray();
    return res.status(200).json(pages);
  }

  // Handle PUT request - Update an existing page
// Handle PUT request - Update an existing page
if (req.method === "PUT") {
  try {
    // Run multer middleware to handle file upload
    await runMiddleware(req, res, upload.single('metaImage')); // 'metaImage' is the file field name
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  // Extract other form data from request body
  const { id, name, slug, content, metaTitle, metaDescription } = req.body;
  const metaImage = req.file ? `/uploads/${req.file.filename}` : req.body.existingMetaImage; // Use new image or keep the existing one

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid page ID" });
  }

  const updatedPage = await db.collection("pages").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        slug,
        content,
        metaTitle,
        metaDescription,
        metaImage,
        updatedAt: new Date(),
      },
    }
  );

  if (updatedPage.matchedCount === 0) {
    return res.status(404).json({ message: "Page not found" });
  }

  return res.status(200).json({ message: "Page updated" });
}


  // Handle DELETE request - Delete a page by slug
  if (req.method === 'DELETE') {
    try {
      const { slug } = req.query;  // Fetch slug from query string

      if (!slug) {
        return res.status(400).json({ message: 'Slug is required' });  // Ensure we have the slug
      }

      const result = await db.collection('pages').deleteOne({ slug });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Page not found' });  // No page with this slug
      }

      return res.status(200).json({ message: 'Page deleted successfully' });
    } catch (error) {
      console.error('Error deleting page:', error);
      return res.status(500).json({ message: 'Internal Server Error', error });
    }
  }

  // If the method is not allowed
  res.status(405).json({ message: "Method not allowed" });
}