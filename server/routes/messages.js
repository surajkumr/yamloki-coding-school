const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Basic POST to create message and email admin
router.post('/', async (req, res) => {
  const { name, phone, email, note } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Missing fields' });
  try {
    const msg = new Message({ name, phone, email, note });
    await msg.save();

    // send email to admin
    if (process.env.SMTP_HOST && process.env.ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `Callback request from ${name}`,
        text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email || ''}\nNote: ${note || ''}`
      };

      transporter.sendMail(mailOptions).catch(err => console.error('Mail error', err));
    }

    res.json({ ok: true, id: msg._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: list messages (JWT-protected + admin email check)
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    // only allow the ADMIN_EMAIL from env to fetch messages
    if (!process.env.ADMIN_EMAIL || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const list = await Message.find().sort({ sentAt: -1 }).limit(200);
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
