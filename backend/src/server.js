const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

const videoRoutes = require('./routes/videoRoutes');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Make uploads statically accessible

app.use('/api/videos', videoRoutes);


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Spacture AI Video Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
