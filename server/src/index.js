const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const authRouter = require('./routes/authRouter')

app.use(cors());
app.use (express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRouter);

app.get('/api/test', (req, res) => {
    res.json({message: 'Settle backend is running!'});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});