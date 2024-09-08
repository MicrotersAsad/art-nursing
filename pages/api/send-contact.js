import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../utils/mongodb'; // Utility for connecting to MongoDB

export default async function handler(req, res) {
  try {
    // Connect to the MongoDB database
    const { db } = await connectToDatabase();

    if (req.method === 'POST') {
      const { name, email, subject, message, replyToEmail } = req.body;

      // If `replyToEmail` exists, it's a reply operation
      if (replyToEmail) {
        // Send reply email
        const emailConfig = await db.collection('emailConfig').findOne();
        if (!emailConfig) {
          return res.status(500).json({ error: 'Email configuration not found' });
        }

        const transporter = nodemailer.createTransport({
          host: emailConfig.smtpHost,
          port: emailConfig.smtpPort,
          auth: {
            user: emailConfig.user,
            pass: emailConfig.pass,
          },
        });

        // Send reply email to the user
        const replyOptions = {
          from: `${emailConfig.fromName} <${emailConfig.user}>`,
          to: replyToEmail,  // Sending reply to the user's email
          subject: 'Reply to Your Contact Submission',
          text: message,
        };

        await transporter.sendMail(replyOptions);

        res.status(200).json({ message: 'Reply sent successfully!' });
        return;
      }

      // If no `replyToEmail`, proceed with saving the contact form data
      // Save contact form data to the contactdata collection
      await db.collection('contactdata').insertOne({
        name,
        email,
        subject,
        message,
        createdAt: new Date(),
      });

      // Retrieve the email configuration from the database
      const emailConfig = await db.collection('emailConfig').findOne();
      if (!emailConfig) {
        return res.status(500).json({ error: 'Email configuration not found' });
      }

      // Configure the nodemailer transporter using dynamic SMTP settings
      const transporter = nodemailer.createTransport({
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort,
        auth: {
          user: emailConfig.user,
          pass: emailConfig.pass,
        },
      });

      // Admin email
      const mailOptionsAdmin = {
        from: `${emailConfig.fromName} <${emailConfig.user}>`,
        to: emailConfig.user,
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new contact form submission from:
        
        Name: ${name}
        Email: ${email}
        Message: ${message}`,
      };

      // User thank you email
      const mailOptionsUser = {
        from: `${emailConfig.fromName} <${emailConfig.user}>`,
        to: email,
        subject: 'Thank you for contacting us!',
        text: `Hello ${name},
        
        Thank you for reaching out. We have received your message and will get back to you shortly.
        
        Best regards,
        YT Tools`,
      };

      // Send the emails
      await transporter.sendMail(mailOptionsAdmin);
      await transporter.sendMail(mailOptionsUser);

      res.status(200).json({ message: 'Form data saved and emails sent successfully' });

    } else if (req.method === 'GET') {
      // Handle GET request to fetch all contact form submissions
      const contacts = await db.collection('contactdata').find().toArray();
      res.status(200).json({ success: true, data: contacts });

    } else if (req.method === 'DELETE') {
      // Handle DELETE request to delete a specific contact form submission
      const { id } = req.query;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid ID provided' });
      }

      const result = await db.collection('contactdata').deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Contact form submission deleted successfully' });
      } else {
        res.status(404).json({ error: 'Contact form submission not found' });
      }

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error processing the request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
