const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});