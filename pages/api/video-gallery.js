import { connectToDatabase } from '../../utils/mongodb';

export const config = {
  api: {
    bodyParser: true, // Enable JSON body parser
  },
};

const handler = async (req, res) => {
  const { db } = await connectToDatabase();

  if (req.method === 'POST') {
    try {
      const { videoUrl } = req.body;

      if (!videoUrl) {
        return res.status(400).json({ message: 'No video URL provided.' });
      }

      // Insert the new video URL into the database
      const galleryVideo = { videoUrl };
      const result = await db.collection('video-gallery').insertOne(galleryVideo);

      res.status(201).json({ message: 'Video URL added successfully!', newVideo: galleryVideo });
    } catch (error) {
      console.error('Error adding video URL:', error);
      res.status(500).json({ message: 'Error adding video URL', error });
    }
  } else if (req.method === 'GET') {
    try {
      const videos = await db.collection('video-gallery').find({}).toArray();
      res.status(200).json(videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Error fetching videos', error });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'No ID provided.' });
      }

      const result = await db.collection('video-gallery').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Video URL deleted successfully.' });
      } else {
        res.status(404).json({ message: 'Video URL not found.' });
      }
    } catch (error) {
      console.error('Error deleting video URL:', error);
      res.status(500).json({ message: 'Error deleting video URL', error });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
