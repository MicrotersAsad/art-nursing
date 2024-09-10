import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/mongodb';

// Helper function to create slugs from titles
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')      // Remove all non-word characters except hyphens
    .replace(/\-\-+/g, '-')        // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '')            // Trim hyphens from the start
    .replace(/-+$/, '');           // Trim hyphens from the end
};

// Multer setup for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,  // Disable default body parser for handling file uploads
  },
};

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

const handler = async (req, res) => {
  const { db } = await connectToDatabase();
  const { id, slug } = req.query;  // Extracting query params (id, slug)

  if (req.method === 'POST') {
    try {
      // Run multer middleware to handle file upload
      await runMiddleware(req, res, upload.single('file'));

      const { title, content, department } = req.body;
      const file = req.file;
      const currentDate = new Date();

      if (!file && !content && !department) {
        return res.status(400).json({ message: 'A file, content, or department is required.' });
      }

      const filePath = file ? `/uploads/${file.filename}` : null;
      const slug = createSlug(title); // Create slug from title

      const notice = {
        title: title || 'Untitled',
        department: department || 'department',
        content: content || null,
        filePath,
        slug,                         // Store slug in database
        date: currentDate,
      };

      const result = await db.collection('results').insertOne(notice);
      
      // Fetch the inserted document using insertedId
      const createdNotice = await db.collection('results').findOne({ _id: result.insertedId });
      
      return res.status(201).json({ message: 'Notice created successfully!', notice: createdNotice });
    } catch (error) {
      console.error('Error creating notice:', error);
      return res.status(500).json({ message: 'Error creating notice', error });
    }
  }

  if (req.method === 'GET') {
    try {
      if (id) {
        // Fetch a specific notice by its ID
        const notice = await db.collection('results').findOne({ _id: new ObjectId(id) });
        if (!notice) {
          return res.status(404).json({ message: 'Notice not found' });
        }
        return res.status(200).json(notice);
      } else if (slug) {
        // Fetch a specific notice by its slug
        const notice = await db.collection('results').findOne({ slug });
        if (!notice) {
          return res.status(404).json({ message: 'Notice not found' });
        }
        return res.status(200).json(notice);
      } else {
        // Fetch all results
        const results = await db.collection('results').find({}).toArray();
        return res.status(200).json(results);
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch results', error });
    }
  }

  if (req.method === 'PUT') {
    try {
      await runMiddleware(req, res, upload.single('file'));

      const { id, title, content, department } = req.body;
      const file = req.file;

      if (!id) {
        return res.status(400).json({ message: 'ID is required to update a notice.' });
      }

      const filePath = file ? `/uploads/${file.filename}` : undefined;
      const slug = createSlug(title);  // Create slug from title during update

      const updateData = {
        ...(title && { title }),
        ...(content && { content }),
        ...(department && { department }),
        ...(slug && { slug }),           // Include slug if title is updated
        ...(filePath && { filePath }),   // Include file path if a new file is uploaded
      };

      const result = await db.collection('results').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Notice not found.' });
      }

      const updatedNotice = await db.collection('results').findOne({ _id: new ObjectId(id) });
      return res.status(200).json({ message: 'Notice updated successfully!', notice: updatedNotice });
    } catch (error) {
      console.error('Error updating notice:', error);
      return res.status(500).json({ message: 'Error updating notice', error });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'ID is required to delete a notice.' });
      }

      const result = await db.collection('results').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Notice not found.' });
      }

      return res.status(200).json({ message: 'Notice deleted successfully!' });
    } catch (error) {
      console.error('Error deleting notice:', error);
      return res.status(500).json({ message: 'Error deleting notice', error });
    }
  }

  res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
  return res.status(405).json({ message: `Method ${req.method} not allowed.` });
};

export default handler;
