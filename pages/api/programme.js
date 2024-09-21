import { connectToDatabase } from '../../utils/mongodb';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure Multer storage options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable the body parser to handle file uploads
  },
};

// Middleware to handle file uploads using Multer
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

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const collection = db.collection('programme');

  if (req.method === 'POST') {
    try {
      // Run Multer middleware to handle the file upload
      await runMiddleware(req, res, upload.fields([
        { name: 'deanImage', maxCount: 1 },
        { name: 'headImage', maxCount: 1 },
        { name: 'facultyImages', maxCount: 20 }, // Allow up to 20 faculty images
      ]));

      // Extract form data from req.body and provide default values
      const {
        name = '',
        slug = '',
        departmentInfo = '',
        salientFeatures = '',
        curriculumStructure = '',
        eligibilityRequirements = '',
        tuitionFees = '',
        deanMessage = '',
        deanName = '',
        headName = '',
        headMessage = '',
      } = req.body;

      // Handle file uploads (if present)
      const deanImage = req.files?.deanImage?.[0]?.filename ? `/uploads/${req.files.deanImage[0].filename}` : null;
      const headImage = req.files?.headImage?.[0]?.filename ? `/uploads/${req.files.headImage[0].filename}` : null;

      // Process faculty images (if present)
      const facultyImages = req.files?.facultyImages || [];
      const facultyMembers = req.body?.facultyMembers ? JSON.parse(req.body.facultyMembers) : [];

      facultyMembers.forEach((facultyMember, index) => {
        if (facultyImages[index] && facultyImages[index].filename) {
          facultyMember.image = `/uploads/${facultyImages[index].filename}`;
        }
      });

      // Prepare the program data to be inserted into the database
      const programData = {
        name,
        slug,
        departmentInfo,
        facultyMembers,
        salientFeatures,
        curriculumStructure,
        eligibilityRequirements,
        tuitionFees,
        deanName,
        deanMessage,
        deanImage,
        headMessage,
        headName,
        headImage,
        createdAt: new Date(),
      };

      // Insert program data into the database
      const result = await collection.insertOne(programData);

      // Return success response
      res.status(201).json({ success: true, message: 'Program created successfully', data: { id: result.insertedId } });
    } catch (error) {
      console.error('Error creating program:', error);
      res.status(500).json({ success: false, message: 'Failed to create program', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { slug } = req.query; // Get the slug from the URL
      // Run Multer middleware to handle the file upload
      await runMiddleware(req, res, upload.fields([
        { name: 'deanImage', maxCount: 1 },
        { name: 'headImage', maxCount: 1 },
        { name: 'facultyImages', maxCount: 20 }, // Allow up to 20 faculty images
      ]));

      // Extract form data
      const {
        name = '',
        departmentInfo = '',
        salientFeatures = '',
        curriculumStructure = '',
        eligibilityRequirements = '',
        tuitionFees = '',
        deanMessage = '',
        deanName = '',
        headName = '',
        headMessage = '',
      } = req.body;

      // Handle file uploads
      const deanImage = req.files?.deanImage?.[0]?.filename ? `/uploads/${req.files.deanImage[0].filename}` : null;
      const headImage = req.files?.headImage?.[0]?.filename ? `/uploads/${req.files.headImage[0].filename}` : null;

      // Process faculty images
      const facultyImages = req.files?.facultyImages || [];
      const facultyMembers = req.body?.facultyMembers ? JSON.parse(req.body.facultyMembers) : [];

      facultyMembers.forEach((facultyMember, index) => {
        if (facultyImages[index] && facultyImages[index].filename) {
          facultyMember.image = `/uploads/${facultyImages[index].filename}`;
        }
      });

      // Prepare the updated program data
      const updatedProgramData = {
        name,
        departmentInfo,
        facultyMembers,
        salientFeatures,
        curriculumStructure,
        eligibilityRequirements,
        tuitionFees,
        deanName,
        deanMessage,
        deanImage: deanImage || undefined, // Use existing image if not updated
        headMessage,
        headName,
        headImage: headImage || undefined, // Use existing image if not updated
        updatedAt: new Date(),
      };

      // Update the program in the database
      const result = await collection.updateOne(
        { slug }, // Match the program by slug
        { $set: updatedProgramData }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ success: false, message: 'Program not found or no changes made' });
      }

      // Return success response
      res.status(200).json({ success: true, message: 'Program updated successfully' });
    } catch (error) {
      console.error('Error updating program:', error);
      res.status(500).json({ success: false, message: 'Failed to update program', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { slug } = req.query; // Get the slug from the URL
      // Delete the program from the database
      const result = await collection.deleteOne({ slug });

      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Program not found' });
      }

      // Return success response
      res.status(200).json({ success: true, message: 'Program deleted successfully' });
    } catch (error) {
      console.error('Error deleting program:', error);
      res.status(500).json({ success: false, message: 'Failed to delete program', error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const { slug } = req.query;
  
      if (slug) {
        // If slug is provided, fetch a single program
        const program = await collection.findOne({ slug });
        if (!program) {
          return res.status(404).json({ success: false, message: 'Program not found' });
        }
        res.status(200).json({ success: true, data: program });
      } else {
        // Otherwise, fetch all programs
        const programmes = await collection.find({}).toArray();
        res.status(200).json({ success: true, data: programmes });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to fetch program(s)', error: error.message });
    }
    
  } else {
    res.setHeader('Allow', ['POST', 'PUT', 'DELETE', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
