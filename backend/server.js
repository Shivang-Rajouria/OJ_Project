const authRoutes = require('./routes/auth.js')
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');



const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Backend working!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use('/api/auth', authRoutes);

require('dotenv').config();