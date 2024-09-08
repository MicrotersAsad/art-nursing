import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb'; // Import ObjectId for MongoDB document updates
import { promisify } from 'util';

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

// Promisify the middleware to make it compatible with async/await
const runMiddleware = promisify(uploadMiddleware);

export const config = {
  api: {
    bodyParser: false, // Disable Next.js built-in body parser to use multer
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    try {
      // Run the multer middleware to handle the file upload
      await runMiddleware(req, res);

      // Retrieve form data from request body
      const { heading, subHeading, buttonText, buttonLink } = req.body;
      const img = `/uploads/${req.file.filename}`;

      // Insert the new slider into the database
      const newSlider = {
        img,
        heading,
        subHeading,
        buttonText,
        buttonLink,
      };

      await db.collection('sliders').insertOne(newSlider);

      res.status(201).json({ message: 'Slider uploaded successfully!', newSlider });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading slider', error });
    }
  } 
  // Get all sliders
  else if (req.method === 'GET') {
    try {
      // Retrieve all sliders from the database
      const sliders = await db.collection('sliders').find({}).toArray();
      res.status(200).json(sliders);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving sliders', error });
    }
  }
  // Update a slider (PUT)
  else if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Extract the ID from the request query
      const { heading, subHeading, buttonText, buttonLink } = req.body;

      const updatedFields = {
        heading,
        subHeading,
        buttonText,
        buttonLink,
      };

      // Update the slider with the provided ID
      await db.collection('sliders').updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });

      res.status(200).json({ message: 'Slider updated successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating slider', error });
    }
  } 
  // Delete a slider (DELETE)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Extract the ID from the request query

      // Delete the slider with the provided ID
      await db.collection('sliders').deleteOne({ _id: new ObjectId(id) });

      res.status(200).json({ message: 'Slider deleted successfully!' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting slider', error });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
