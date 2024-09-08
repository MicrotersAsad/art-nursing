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

  // Handle POST request to upload teacher info
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

        const teacherInfo = {
          name,
          designation,
          department,
          photoPath,
        };

        // Save teacher info to the database
        await db.collection('teacher').insertOne(teacherInfo);

        res.status(201).json({ message: 'teacher info added successfully!', teacherInfo });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error processing request', error });
    }

  // Handle GET request to fetch all teacher info
  } else if (req.method === 'GET') {
    try {
      const teacherList = await db.collection('teacher').find({}).toArray();
      res.status(200).json(teacherList);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teacher info', error });
    }

  // Handle PUT request to update teacher info
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

        const updatedteacherInfo = {
          name,
          designation,
          department,
          photoPath,
        };

        await db.collection('teacher').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedteacherInfo }
        );

        res.status(200).json({ message: 'teacher info updated successfully!', updatedteacherInfo });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating teacher info', error });
    }

  // Handle DELETE request to delete teacher info
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.collection('teacher').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'teacher deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting teacher info', error });
    }

  // Handle invalid methods
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
