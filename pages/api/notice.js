import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb'; // Import ObjectId for updating and deleting documents
import { connectToDatabase } from '../../utils/mongodb';

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
    bodyParser: false,
  },
};

// Handler function for POST, GET, PUT, and DELETE requests
const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  // Handle POST request to upload files and save metadata
  if (req.method === 'POST') {
    try {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading file', error: err });
        }

        const { title, content } = req.body;
        const file = req.file;
        const currentDate = new Date(); // Get the current date

        // Ensure at least a file or content is provided
        if (!file && !content) {
          return res.status(400).json({ message: 'Either a file or content is required.' });
        }

        const filePath = file ? `/uploads/${file.filename}` : null;

        // Prepare the notice object
        const notice = {
          title: title || 'Untitled', // Default title if not provided
          content: content || null,   // Optional content
          filePath: filePath,         // Path to the uploaded file
          date: currentDate,          // Automatically set the current date
        };

        // Save to the database
        await db.collection('notices').insertOne(notice);

        res.status(201).json({ message: 'Notice created successfully!', notice });
      });
    } catch (error) {
      console.error('Error creating notice:', error);
      res.status(500).json({ message: 'Error creating notice', error });
    }

  // Handle GET request to fetch all notices
  } else if (req.method === 'GET') {
    try {
      const notices = await db.collection('notices').find({}).toArray();
      res.status(200).json(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
      res.status(500).json({ message: 'Error fetching notices', error });
    }

  // Handle PUT request to update an existing notice
  } else if (req.method === 'PUT') {
    try {
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading file', error: err });
        }

        const { id, title, content } = req.body;
        const file = req.file;

        // Ensure ID is provided
        if (!id) {
          return res.status(400).json({ message: 'ID is required to update a notice.' });
        }

        const filePath = file ? `/uploads/${file.filename}` : undefined;

        // Prepare the update object
        const updateData = {
          ...(title && { title }), // Update title if provided
          ...(content && { content }), // Update content if provided
          ...(filePath && { filePath }), // Update filePath if new file is uploaded
        };

        // Update the notice in the database
        await db.collection('notices').updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        res.status(200).json({ message: 'Notice updated successfully!' });
      });
    } catch (error) {
      console.error('Error updating notice:', error);
      res.status(500).json({ message: 'Error updating notice', error });
    }

  // Handle DELETE request to delete a notice
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      // Ensure ID is provided
      if (!id) {
        return res.status(400).json({ message: 'ID is required to delete a notice.' });
      }

      // Delete the notice from the database
      const result = await db.collection('notices').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Notice deleted successfully!' });
      } else {
        res.status(404).json({ message: 'Notice not found.' });
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
      res.status(500).json({ message: 'Error deleting notice', error });
    }

  // Handle invalid methods
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
