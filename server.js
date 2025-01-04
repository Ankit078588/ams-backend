const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require('./config/db_connection');
const PORT = process.env.PORT || 4000;


const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
// const authRoutes = require('./routes/authRoute');
// app.use('/api/auth', authRoutes);
// app.listen(PORT);


// routes
const authRoutes = require('./routes/authRoute');
app.use('/api/auth', authRoutes);


app.listen(PORT);