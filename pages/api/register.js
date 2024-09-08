import multer from 'multer';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../utils/mongodb';
import { sendVerificationEmail } from '../../utils/sendVerificationEmail';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Set up multer storage engine to store files in the 'public/uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir); // Save files in 'public/uploads'
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 } // Limit file size to 100 KB
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Use multer middleware to handle the file upload
    upload.single('profileImage')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ message: 'File upload error' });
      } else if (err) {
        return res.status(500).json({ message: 'Unknown error' });
      }

      const { username, email, password } = req.body;
      const profileImagePath = req.file ? `/uploads/${req.file.filename}` : null; // Path to the uploaded image

      // Set role directly as 'super admin'
      const finalRole = 'super admin';

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate a verification token
      const verificationToken = uuidv4();

      // Connect to the database
      const { db } = await connectToDatabase();

      // Insert user data into the database
      const result = await db.collection('user').insertOne({
        username,
        email,
        password: hashedPassword,
        profileImage: profileImagePath, // Save image path instead of base64
        verificationToken,
        verified: false,
        role: finalRole, // Automatically assign 'super admin' role
        createdAt: new Date(),
      });

      // Send verification email
      await sendVerificationEmail(email, username, verificationToken);

      res.status(201).json({ message: 'Registration successful! Please check your email to verify.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
