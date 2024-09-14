import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

// Multer setup for file storage
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

// Helper to run multer middleware manually
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

// Disable bodyParser for file upload handling
export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  // Handle POST request to upload governing info
  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('photo')); // Apply multer middleware for single file upload

      const { name, designation } = req.body;
      const file = req.file;
      const photoPath = file ? `/uploads/${file.filename}` : null;

      if (!name || !designation) {
        return res.status(400).json({ message: 'Name and Designation are required.' });
      }

      const governingInfo = {
        name,
        designation,
        photoPath,
      };

      // Save governing info to the database
      await db.collection('governing').insertOne(governingInfo);

      res.status(201).json({ message: 'Governing info added successfully!', governingInfo });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error });
    }

    // Handle GET request to fetch all governing info
  } else if (req.method === 'GET') {
    try {
      const governingList = await db.collection('governing').find({}).toArray();
      res.status(200).json(governingList);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching governing info', error });
    }

    // Handle PUT request to update governing info
  } else if (req.method === 'PUT') {
    try {
      await runMiddleware(req, res, upload.single('photo')); // Apply multer middleware for single file upload

      const { id, name, designation } = req.body;
      const file = req.file;
      const photoPath = file ? `/uploads/${file.filename}` : req.body.existingPhotoPath; // Keep existing photo if no new one

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid governing info ID.' });
      }

      if (!name || !designation) {
        return res.status(400).json({ message: 'Name and Designation are required.' });
      }

      const updatedGoverningInfo = {
        name,
        designation,
        photoPath,
      };

      await db.collection('governing').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedGoverningInfo }
      );

      res.status(200).json({ message: 'Governing info updated successfully!', updatedGoverningInfo });
    } catch (error) {
      res.status(500).json({ message: 'Error updating governing info', error });
    }

    // Handle DELETE request to delete governing info
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid governing info ID.' });
      }

      await db.collection('governing').deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({ message: 'Governing info deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting governing info', error });
    }

    // Handle invalid methods
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
