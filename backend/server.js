const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./db');

const problemsRoutes = require('./routes/problems');
const runRoutes = require('./routes/run');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/problems', problemsRoutes);
app.use('/api/run', runRoutes);
app.use('/api/auth', authRoutes);
app.get('/', (req, res) => res.send('BranchBench Backend running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
