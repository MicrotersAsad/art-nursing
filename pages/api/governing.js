import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb'; // For MongoDB ObjectId

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
      upload.single('photo')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading photo', error: err });
        }

        const { name, designation } = req.body;
        const file = req.file;
        const photoPath = file ? `/uploads/${file.filename}` : null;

        if (!name || !designation) {
          return res.status(400).json({ message: 'Name, Designation, and Department are required.' });
        }

        const governingInfo = {
          name,
          designation,
          photoPath,
        };

        // Save governing info to the database
        await db.collection('governing').insertOne(governingInfo);

        res.status(201).json({ message: 'governing info added successfully!', governingInfo });
      });
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
      upload.single('photo')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading photo', error: err });
        }

        const { id, name, designation, department } = req.body;
        const file = req.file;
        const photoPath = file ? `/uploads/${file.filename}` : req.body.existingPhotoPath; // Keep existing photo if no new one

        if (!name || !designation) {
          return res.status(400).json({ message: 'Name, Designation, and Department are required.' });
        }

        const updatedgoverningInfo = {
          name,
          designation,
          photoPath,
        };

        await db.collection('governing').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedgoverningInfo }
        );

        res.status(200).json({ message: 'governing info updated successfully!', updatedgoverningInfo });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating governing info', error });
    }

  // Handle DELETE request to delete governing info
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.collection('governing').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'governing deleted successfully!' });
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
