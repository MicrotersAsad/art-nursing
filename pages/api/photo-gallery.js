import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { ObjectId } from 'mongodb'; // Import ObjectId for MongoDB document updates

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
const uploadMiddleware = upload.single('img');
const runMiddleware = promisify(uploadMiddleware);

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res);

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const img = `/uploads/${req.file.filename}`;
      const galleryImg = { img };
      const result = await db.collection('photo-gallery').insertOne(galleryImg);

      res.status(201).json({ message: 'Image uploaded successfully!', newImage: galleryImg });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Error uploading image', error });
    }
  } else if (req.method === 'GET') {
    try {
      const gallery = await db.collection('photo-gallery').find({}).toArray();
      res.status(200).json(gallery);
    } catch (error) {
      console.error('Error fetching images:', error);
      res.status(500).json({ message: 'Error fetching images', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'No image ID provided.' });
      }

      const objectId = new ObjectId(id);

      // Optionally, you might want to delete the image file from the server too
      // Make sure to handle this part if you need it

      const result = await db.collection('photo-gallery').deleteOne({ _id: objectId });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Image deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Image not found.' });
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Error deleting image', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
