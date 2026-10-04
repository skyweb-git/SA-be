import Contact from '../models/Contact.js';
import Lead from '../models/Lead.js';
import { sendContactNotification } from '../config/mailer.js';

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    try {
      await Lead.create({
        id: 'lead-contact-' + contact._id.toString(),
        fullName: name,
        email,
        phone: phone || '',
        unitInterest: subject || 'General Inquiry',
        message,
        source: 'Website Contact Form',
        status: 'New'
      });
    } catch (e) {}

    // Trigger SMTP email notifications asynchronously (non-blocking)
    sendContactNotification({
      name,
      email,
      phone,
      subject,
      message
    }).catch(mailErr => console.warn('[SMTP Notice] Contact email error:', mailErr.message));

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will reply as soon as possible.',
      data: contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Public (or Admin)
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    next(error);
  }
};
