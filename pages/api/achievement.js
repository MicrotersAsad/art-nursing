import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/mongodb';

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads/achievement');
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

  if (req.method === 'POST') {
    try {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading image', error: err });
        }

        const { title } = req.body;
        const file = req.file;
        const imagePath = file ? `/uploads/achievement/${file.filename}` : null;

        if (!title || !file) {
          return res.status(400).json({ message: 'Title and image are required.' });
        }

        const achievement = { title, imagePath };
        await db.collection('achievement').insertOne(achievement);

        res.status(201).json({ message: 'Achievement added successfully!', achievement });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error adding achievement', error });
    }
  } else if (req.method === 'PUT') {
    try {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error uploading image', error: err });
        }

        const { id, title } = req.body;
        const file = req.file;
        const imagePath = file ? `/uploads/achievement/${file.filename}` : req.body.existingImagePath;

        if (!id || !title) {
          return res.status(400).json({ message: 'ID and title are required.' });
        }

        const updatedAchievement = { title, imagePath };

        await db.collection('achievement').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedAchievement }
        );

        res.status(200).json({ message: 'Achievement updated successfully!', updatedAchievement });
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating achievement', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      await db.collection('achievement').deleteOne({ _id: new ObjectId(id) });
      res.status(200).json({ message: 'Achievement deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting achievement', error });
    }
  } else if (req.method === 'GET') {
    try {
      const achievements = await db.collection('achievement').find({}).toArray();
      res.status(200).json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching achievements', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
};

export default handler;
