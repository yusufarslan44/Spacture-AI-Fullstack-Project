const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Spacture AI Video Backend Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
