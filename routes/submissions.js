import express from 'express';
import Contact from '../models/Contact.js';
import Reservation from '../models/Reservation.js';

const router = express.Router();

// Lightweight email + phone validators (server-side defense)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+\d][\d\s\-()]{6,29}$/;

// POST /api/contact
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, topic, message, consent } = req.body || {};

    if (!name || !email || !phone || !topic || !message)
      return res.status(400).json({ error: 'All fields are required.' });
    if (!emailRegex.test(email))
      return res.status(400).json({ error: 'Please provide a valid email.' });
    if (!phoneRegex.test(phone))
      return res.status(400).json({ error: 'Please provide a valid phone number.' });
    if (consent !== true)
      return res.status(400).json({ error: 'Consent is required to contact you.' });

    const doc = await Contact.create({ name, email, phone, topic, message, consent });
    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ error: 'Something went wrong on our side.' });
  }
});

// POST /api/reservation
router.post('/reservation', async (req, res) => {
  try {
    const { email, phone } = req.body || {};

    if (!email || !phone)
      return res.status(400).json({ error: 'Email and phone are both required.' });
    if (!emailRegex.test(email))
      return res.status(400).json({ error: 'Please provide a valid email.' });
    if (!phoneRegex.test(phone))
      return res.status(400).json({ error: 'Please provide a valid phone number.' });

    const doc = await Reservation.create({ email, phone });
    return res.status(201).json({ ok: true, id: doc._id });
  } catch (err) {
    console.error('Reservation submission error:', err);
    return res.status(500).json({ error: 'Something went wrong on our side.' });
  }
});

export default router;
