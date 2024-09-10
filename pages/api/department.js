import { connectToDatabase } from '../../utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { method, query: { id }, body } = req;

  // Connect to the database
  const { db } = await connectToDatabase();
  const departmentCollection = db.collection('department');

  switch (method) {
    case 'GET':
      try {
        if (id) {
          // Fetch a specific category by ID
          const category = await departmentCollection.findOne({ _id: new ObjectId(id) });
          if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
          }
          res.status(200).json(category);
        } else {
          // Fetch all department
          const department = await departmentCollection.find({}).toArray();
          res.status(200).json(department);
        }
      } catch (error) {
        console.error("GET Error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        const { name,slug, description } = body;

        if (!name || !description) {
          throw new Error('Name and description are required');
        }

        // Create the new category object
        const newCategory = {
          name,
          slug,
          description,
          createdAt: new Date(),
        };

        // Insert the new category into the database
        const result = await departmentCollection.insertOne(newCategory);
        res.status(201).json(result.ops[0]);
      } catch (error) {
        console.error("POST Error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const { name, description } = body;

        if (!name || !description || !slug) {
          throw new Error('Name and description are required');
        }

        // Update the category in the database
        const updateCategory = {
          $set: {
            name,
            slug,
            description,
          }
        };

        const result = await departmentCollection.updateOne(
          { _id: new ObjectId(id) },
          updateCategory
        );

        if (result.matchedCount === 0) {
          throw new Error('Category not found');
        }

        // Return the updated category
        const updatedCategory = await departmentCollection.findOne({ _id: new ObjectId(id) });
        res.status(200).json(updatedCategory);
      } catch (error) {
        console.error("PUT Error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const result = await departmentCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        res.status(200).json({ success: true, message: 'Category deleted successfully' });
      } catch (error) {
        console.error("DELETE Error:", error);
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(405).json({ success: false, error: 'Method not allowed' });
      break;
  }
}
