import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // Handle GET request - Fetch all menus with submenus
  if (req.method === 'GET') {
    try {
      const menus = await db.collection('menus').find().toArray();
      return res.status(200).json(menus);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      return res.status(500).json({ message: 'Failed to fetch menus', error: error.message });
    }
  }

  // Handle POST request - Create a new menu or submenu
  if (req.method === 'POST') {
    const { title, link, openIn, order, parentMenuId, status } = req.body;

    // Validate required fields
    if (!title || !link || !openIn || order === undefined || !status) {
      return res.status(400).json({ message: 'Title, Link, Open In, Order, and Status are required' });
    }

    try {
      const menuData = {
        title,
        link,
        openIn,
        order: parseInt(order, 10),
        status,
        createdAt: new Date(),
      };

      if (parentMenuId) {
        // Add submenu to the parent menu's submenus array
        const parentId = new ObjectId(parentMenuId);

        const updateResult = await db.collection('menus').updateOne(
          { _id: parentId },
          { $push: { submenus: menuData } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(404).json({ message: 'Parent menu not found' });
        }

        return res.status(201).json({ message: 'Submenu added successfully' });
      } else {
        // Create a new parent menu
        const result = await db.collection('menus').insertOne({ ...menuData, submenus: [] });
        return res.status(201).json({ message: 'Menu created successfully', id: result.insertedId });
      }
    } catch (error) {
      console.error('Failed to create menu or submenu:', error);
      return res.status(500).json({ message: 'Failed to create menu or submenu', error: error.message });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
