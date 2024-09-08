import bcrypt from 'bcryptjs'; // bcryptjs is commonly used in Node.js apps
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Check if the JWT secret is present in the environment variables
  if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
    return res.status(500).json({ message: 'Server configuration error. Missing JWT Secret.' });
  }

  try {
    // Connect to the database
    const { db } = await connectToDatabase();
  
    // Find user by email, only retrieve necessary fields (including profileImage)
    const user = await db.collection('user').findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1, username: 1, role: 1, profileImage: 1 } }
    );
  
    console.log('User found:', user); // Add this line to log the user object
  
    // Validate if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Compare the hashed password with the user's input
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  
    // Generate JWT token for the authenticated user
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: user.role },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '1y' } // Set token expiration to 1 year
    );
  
    // Return the token along with user profile information
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage || null, // Include profileImage if it exists
      },
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Login Error:', error);
  
    // Return a generic error message
    return res.status(500).json({ message: 'Internal server error' });
  }
}  