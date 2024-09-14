import { connectToDatabase } from '../../utils/mongodb';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Disable Next.js's default body parser to handle multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure `multer` for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads', // Directory to save files
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save with a timestamp for uniqueness
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false); // Allow only image files
    }
    cb(null, true);
  },
}).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'favicon', maxCount: 1 },
  { name: 'heroIcon', maxCount: 4 }, // Handling multiple heroIcons
  { name: 'aboutImage', maxCount: 1 }
]);

// Middleware to handle file upload
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

// Helper function to delete a file
const deleteFile = (filePath) => {
  try {
    fs.unlinkSync(path.join(process.cwd(), filePath)); // Delete the file
    console.log('File deleted:', filePath);
  } catch (err) {
    console.error('Error deleting file:', filePath, err);
    throw new Error('File deletion failed');
  }
};

// API handler function
export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // Handle GET request - Fetch homepage settings
  if (req.method === 'GET') {
    try {
      const settings = await db.collection('homepageSettings').findOne();
      if (!settings) {
        return res.status(404).json({ message: 'Settings not found' });
      }
      return res.status(200).json(settings);
    } catch (error) {
      console.error('Failed to fetch homepage settings:', error);
      return res.status(500).json({ message: 'Failed to fetch homepage settings', error: error.message });
    }
  }

  // Handle POST request - Create new homepage settings or update existing settings
  if (req.method === 'POST') {
    try {
      // Run the `multer` middleware to handle file uploads
      await runMiddleware(req, res, upload);

      // Access uploaded files from `req.files` and form data from `req.body`
      const logoUrl = req.files.logo ? `/uploads/${req.files.logo[0].filename}` : req.body.logoUrl;
      const faviconUrl = req.files.favicon ? `/uploads/${req.files.favicon[0].filename}` : req.body.faviconUrl;
      const aboutImageUrl = req.files.aboutImage ? `/uploads/${req.files.aboutImage[0].filename}` : req.body.aboutImageUrl;
      // Handle hero area icons (if provided)
      let heroArea = JSON.parse(req.body.heroArea);
      if (req.files.heroIcon) {
        heroArea = heroArea.map((item, index) => ({
          ...item,
          iconUrl: req.files.heroIcon[index] ? `/uploads/${req.files.heroIcon[index].filename}` : item.iconUrl,
        }));
      }

      // Prepare settings object
      const homepageSettings = {
        topHeading: JSON.parse(req.body.topHeading), // { mobileNo, email, quickButtonText, quickButtonLink }
        logoUrl,
        faviconUrl,
        heroArea, // [{ title, description, buttonText, buttonLink, iconUrl }, ...]
        aboutSection: {
            ...JSON.parse(req.body.aboutSection), // { headline, description }
            aboutImageUrl, // Set the uploaded image URL for the About Us section
          },
        counters: JSON.parse(req.body.counters), // [{ headline, counter }, ...]
        ourCourses: JSON.parse(req.body.ourCourses), // [{ iconUrl, heading, description, buttonText, buttonLink }, ...]
        whyChooseANC: JSON.parse(req.body.whyChooseANC), // [{ iconUrl, heading, description }, ...]
        updatedAt: new Date(),
      };

      // Save settings to the database
      const result = await db.collection('homepageSettings').findOneAndUpdate({}, { $set: homepageSettings }, { upsert: true });

      return res.status(200).json({ message: 'Homepage settings updated successfully', result });
    } catch (error) {
      console.error('Failed to update homepage settings:', error);
      return res.status(500).json({ message: 'Failed to update homepage settings', error: error.message });
    }
  }

  // Handle DELETE request - Delete specific uploaded files (logo, favicon, etc.)
  if (req.method === 'DELETE') {
    try {
      const { field, filePath } = req.body;

      if (filePath) {
        // Delete the specified file from the server
        deleteFile(filePath);
      }

      // Update the database to remove the reference to the file
      const updateData = { [field]: '' }; // Clear the file reference (e.g., logoUrl: '')
      const result = await db.collection('homepageSettings').updateOne({}, { $unset: updateData });

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Field not found or already deleted' });
      }

      return res.status(200).json({ message: 'File deleted successfully', result });
    } catch (error) {
      console.error('Failed to delete file or update settings:', error);
      return res.status(500).json({ message: 'Failed to delete file or update settings', error: error.message });
    }
  }

  // Fallback for unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
