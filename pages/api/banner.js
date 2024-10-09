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

  // POST method for creating new slider
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
  
  // GET method for retrieving all sliders
  else if (req.method === 'GET') {
    try {
      // Retrieve all sliders from the database
      const sliders = await db.collection('sliders').find({}).toArray();
      
      if (!sliders || sliders.length === 0) {
        return res.status(404).json({ message: 'Sliders not found' });
      }

      res.status(200).json(sliders);
    } catch (error) {
      console.error('Error retrieving sliders:', error);
      res.status(500).json({ message: 'Error retrieving sliders', error: error.message });
    }
  }

  else if (req.method === 'PUT') {
    try {
      const { id } = req.query; // Request query থেকে ID নেওয়া হচ্ছে
      console.log("Received ID for update:", id);
  
      // ObjectId চেক করা হচ্ছে
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid slider ID' });
      }
  
      const queryId = new ObjectId(id); // ObjectId এ কনভার্ট করা হচ্ছে
      console.log("Final query ID:", queryId);
  
      await runMiddleware(req, res); // Multer middleware রান করা হচ্ছে, ফাইল আপলোড থাকলে
  
      const { heading, subHeading, buttonText, buttonLink } = req.body;
  
      const updatedFields = {
        heading,
        subHeading,
        buttonText,
        buttonLink,
      };
  
      // নতুন ইমেজ আপলোড করা হলে সেটি যোগ করা হচ্ছে
      if (req.file) {
        updatedFields.img = `/uploads/${req.file.filename}`;
      }
  
      // স্লাইডার আপডেট করা হচ্ছে ObjectId দিয়ে
      const result = await db.collection('sliders').updateOne(
        { _id: queryId }, // কনভার্টেড queryId দিয়ে মিলানো হচ্ছে
        { $set: updatedFields } // আপডেট করা ফিল্ডগুলো সেট করা হচ্ছে
      );
  
      // যদি কোনো স্লাইডার ম্যাচ না করে
      if (result.matchedCount === 0) {
        console.log("Slider not found in the database for ID:", queryId);
        return res.status(404).json({ message: 'Slider not found' });
      }
  
      // আপডেটকৃত স্লাইডার পুনরায় নিয়ে আসা
      const updatedSlider = await db.collection('sliders').findOne({ _id: queryId });
  
      res.status(200).json({
        message: 'Slider updated successfully!',
        slider: updatedSlider,  // আপডেটকৃত স্লাইডার রিটার্ন করা হচ্ছে
      });
    } catch (error) {
      console.error('Error updating slider:', error);
      res.status(500).json({ message: 'Error updating slider', error: error.message });
    }
  }
  


  // DELETE method for deleting a slider
  else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Extract the ID from the request query

      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid slider ID' });
      }

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
