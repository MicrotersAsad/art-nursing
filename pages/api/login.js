import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (!process.env.NEXT_PUBLIC_JWT_SECRET) {
    return res.status(500).json({ message: 'Server configuration error. Missing JWT Secret.' });
  }

  try {
    const { db } = await connectToDatabase();

    // Find user by email, retrieve profileImage field
    const user = await db.collection('user').findOne(
      { email },
      { projection: { _id: 1, email: 1, password: 1, username: 1, role: 1, profileImage: 1 } }
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Remove bcrypt for plain password comparison
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Include profileImage in JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username, role: user.role, profileImage: user.profileImage },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: '1y' }
    );

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        profileImage: user.profileImage || null,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
