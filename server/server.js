const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');


const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'));



app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
