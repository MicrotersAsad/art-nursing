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

  // Handle POST request to upload staff info
  if (req.method === 'POST') {
    try {
      upload.single('photo')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading photo', error: err });
        }

        const { name, designation, department } = req.body;
        const file = req.file;
        const photoPath = file ? `/uploads/${file.filename}` : null;

        if (!name || !designation || !department) {
          return res.status(400).json({ message: 'Name, Designation, and Department are required.' });
        }

        const staffInfo = {
          name,
          designation,
          department,
          photoPath,
        };

        // Save staff info to the database
        await db.collection('staff').insertOne(staffInfo);

        res.status(201).json({ message: 'Staff info added successfully!', staffInfo });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error });
    }

  // Handle GET request to fetch all staff info
  } else if (req.method === 'GET') {
    try {
      const staffList = await db.collection('staff').find({}).toArray();
      res.status(200).json(staffList);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching staff info', error });
    }

  // Handle PUT request to update staff info
  } else if (req.method === 'PUT') {
    try {
      upload.single('photo')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading photo', error: err });
        }

        const { id, name, designation, department } = req.body;
        const file = req.file;
        const photoPath = file ? `/uploads/${file.filename}` : req.body.existingPhotoPath; // Keep existing photo if no new one

        if (!name || !designation || !department) {
          return res.status(400).json({ message: 'Name, Designation, and Department are required.' });
        }

        const updatedStaffInfo = {
          name,
          designation,
          department,
          photoPath,
        };

        await db.collection('staff').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedStaffInfo }
        );

        res.status(200).json({ message: 'Staff info updated successfully!', updatedStaffInfo });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating staff info', error });
    }

  // Handle DELETE request to delete staff info
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.collection('staff').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Staff deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting staff info', error });
    }

  // Handle invalid methods
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
