// pages/api/contact.js

import { connectToDatabase } from '../../utils/mongodb';

export default async function handler(req, res) {
  const { method } = req;
  const { db } = await connectToDatabase();

  switch (method) {
    case 'GET':
      try {
        const contactInfo = await db.collection('contact').findOne({});
        res.status(200).json(contactInfo);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching contact information', error });
      }
      break;

    case 'POST':
      try {
        const { address, callToUs, email, socialLinks, locationLink } = req.body;

        if (!address || !callToUs || !email || !locationLink) {
          return res.status(400).json({ message: 'Address, Call to us, Email, and Location Link are required.' });
        }

        const contactInfo = {
          address,
          callToUs,
          email,
          socialLinks,
          locationLink,
        };

        await db.collection('contact').updateOne({}, { $set: contactInfo }, { upsert: true });
        res.status(200).json({ message: 'Contact information saved successfully!' });
      } catch (error) {
        res.status(500).json({ message: 'Error saving contact information', error });
      }
      break;

    case 'DELETE':
      try {
        await db.collection('contact').deleteMany({});
        res.status(200).json({ message: 'Contact information deleted successfully!' });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting contact information', error });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
