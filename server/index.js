require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

// Built-in robust local datastore for seamless local running without Docker or external DB
const localRoutes = require('./localRoutes');
app.use('/api', localRoutes);

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
