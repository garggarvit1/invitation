const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const invitation=require('./routes/invitation')
const dotenv=require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
app.use('/api/persons', require('./routes/Person'));
app.use('/api/person-names', require('./routes/personNames'));
app.use('/api/ask', require('./routes/ask'));
app.use('/api/invitation',invitation);



// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


