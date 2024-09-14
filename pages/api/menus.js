// pages/api/menus.js

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
      return res
        .status(500)
        .json({ message: 'Failed to fetch menus', error: error.message });
    }
  }

  // Handle POST request - Create a new menu or submenu
  else if (req.method === 'POST') {
    const { title, link, openIn, order, parentMenuId, status } = req.body;

    // Validate required fields
    if (!title || !link || !openIn || order === undefined || !status) {
      return res.status(400).json({
        message: 'Title, Link, Open In, Order, and Status are required',
      });
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
        const result = await db
          .collection('menus')
          .insertOne({ ...menuData, submenus: [] });
        return res
          .status(201)
          .json({ message: 'Menu created successfully', id: result.insertedId });
      }
    } catch (error) {
      console.error('Failed to create menu or submenu:', error);
      return res.status(500).json({
        message: 'Failed to create menu or submenu',
        error: error.message,
      });
    }
  }

  // Handle PUT request - Update an existing menu or submenu
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, link, openIn, order, parentMenuId, status } = req.body;

    // Validate menu ID
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    // Validate required fields
    if (!title || !link || !openIn || order === undefined || !status) {
      return res.status(400).json({
        message: 'Title, Link, Open In, Order, and Status are required',
      });
    }

    try {
      const updatedData = {
        title,
        link,
        openIn,
        order: parseInt(order, 10),
        status,
        updatedAt: new Date(),
      };

      if (parentMenuId) {
        updatedData.parentMenuId = new ObjectId(parentMenuId);
      } else {
        updatedData.parentMenuId = null;
      }

      // Update the menu
      const result = await db.collection('menus').updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Menu not found' });
      }

      return res.status(200).json({ message: 'Menu updated successfully' });
    } catch (error) {
      console.error('Failed to update menu:', error);
      return res
        .status(500)
        .json({ message: 'Failed to update menu', error: error.message });
    }
  }

  // Handle DELETE request - Delete an existing menu or submenu
  else if (req.method === 'DELETE') {
    const { id, parentMenuId } = req.query;

    // Validate menu ID
    if (!id || !ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid menu ID' });
    }

    try {
      if (parentMenuId) {
        // Remove submenu from parent menu
        const parentId = new ObjectId(parentMenuId);

        const updateResult = await db.collection('menus').updateOne(
          { _id: parentId },
          { $pull: { submenus: { _id: new ObjectId(id) } } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(404).json({ message: 'Parent menu not found' });
        }

        return res.status(200).json({ message: 'Submenu deleted successfully' });
      } else {
        // Delete parent menu
        const result = await db
          .collection('menus')
          .deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Menu not found' });
        }

        return res.status(200).json({ message: 'Menu deleted successfully' });
      }
    } catch (error) {
      console.error('Failed to delete menu:', error);
      return res
        .status(500)
        .json({ message: 'Failed to delete menu', error: error.message });
    }
  }

  // Handle unsupported methods
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
