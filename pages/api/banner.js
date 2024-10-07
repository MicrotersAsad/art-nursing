import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
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
      const img = req.file ? `/uploads/${req.file.filename}` : '';

      // Insert the new slider into the database
      const newSlider = {
        img,
        heading,
        subHeading,
        buttonText,
        buttonLink,
      };

      const result = await db.collection('sliders').insertOne(newSlider);

      // Respond with the newly inserted slider document
      const insertedSlider = { ...newSlider, _id: result.insertedId };

      res.status(201).json({
        message: 'Slider uploaded successfully!',
        slider: insertedSlider,  // Return the newly inserted slider data
      });
    } catch (error) {
      console.error('Error uploading slider:', error);
      res.status(500).json({ message: 'Error uploading slider', error: error.message });
    }
  } 
  // Get all sliders
  else if (req.method === 'GET') {
    try {
      // Retrieve all sliders from the database
      const sliders = await db.collection('sliders').find({}).toArray();
      res.status(200).json(sliders);
    } catch (error) {
      console.error('Error retrieving sliders:', error);
      res.status(500).json({ message: 'Error retrieving sliders', error: error.message });
    }
  }
  // Update a slider (PUT)
  else if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Extract the ID from the request query
      await runMiddleware(req, res); // Run the multer middleware to handle file upload (if any)
      
      const { heading, subHeading, buttonText, buttonLink } = req.body;

      const updatedFields = {
        heading,
        subHeading,
        buttonText,
        buttonLink,
      };

      // Add the image path if a new image was uploaded
      if (req.file) {
        updatedFields.img = `/uploads/${req.file.filename}`;
      }

      // Update the slider with the provided ID
      const result = await db.collection('sliders').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updatedFields },
        { returnDocument: 'after' }
      );

      if (!result.value) {
        res.status(404).json({ message: 'Slider not found' });
        return;
      }

      res.status(200).json({
        message: 'Slider updated successfully!',
        slider: result.value,  // Return the updated slider data
      });
    } catch (error) {
      console.error('Error updating slider:', error);
      res.status(500).json({ message: 'Error updating slider', error: error.message });
    }
  }
  
  // Delete a slider (DELETE)
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Extract the ID from the request query

      // Delete the slider with the provided ID
      const result = await db.collection('sliders').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Slider not found' });
        return;
      }

      res.status(200).json({ message: 'Slider deleted successfully!' });
    } catch (error) {
      console.error('Error deleting slider:', error);
      res.status(500).json({ message: 'Error deleting slider', error: error.message });
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
};

export default handler;
