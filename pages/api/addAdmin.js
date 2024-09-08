import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { connectToDatabase } from '../../utils/mongodb';

// Multer setup for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads/profileImages');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `profileImage-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    upload.single('profilePicture')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error uploading profile picture', error: err });
      }

      const { firstName, lastName, username, designation, email, password, confirmPassword } = req.body;
      const file = req.file;
      const profileImage = file ? `/uploads/profileImages/${file.filename}` : null;

      // Validation
      if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
      }

      try {
        // Save the user data directly to the database
        const newUser = {
          firstName,
          lastName,
          username,
          designation: designation || '', // Optional field
          email,
          password, // Storing raw password (not hashed)
          profileImage,
          role: 'admin', // Default role to admin
          verified: true, // Admin-added user is automatically verified
        };

        await db.collection('user').insertOne(newUser);

        res.status(201).json({ message: 'User added successfully!', user: newUser });
      } catch (error) {
        res.status(500).json({ message: 'Error adding user', error });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
};

export default handler;
