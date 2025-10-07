require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const msgRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error', err));

app.use('/api/auth', authRoutes);
app.use('/api/messages', msgRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log('Server running on port', PORT));
