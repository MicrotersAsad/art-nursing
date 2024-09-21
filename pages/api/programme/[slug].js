import { connectToDatabase } from '../../../utils/mongodb';

export default async function handler(req, res) {
  const { slug } = req.query; // Fetch slug from query
  const { db } = await connectToDatabase();
  const collection = db.collection('programme');

  if (req.method === 'GET') {
    try {
      // Find the program by slug
      const program = await collection.findOne({ slug });

      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }

      return res.status(200).json({ success: true, data: program });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      // Delete the program by slug
      const result = await collection.deleteOne({ slug });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      return res.status(200).json({ success: true, message: 'Program deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete program', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
