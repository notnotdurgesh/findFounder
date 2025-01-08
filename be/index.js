const express = require('express');
const connectDB = require('./config/db');
const founderRoutes = require('./routes/founderRoutes');
const developerRoutes = require('./routes/developerRoutes');
const applicationRoutes = require('./routes/applications');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./middleware/passport');
const cors = require('cors')
const phoneAuthRoutes = require('./routes/phoneAuth');

const app = express();

// Middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
connectDB();

// Routes
app.use('/founder', founderRoutes);
app.use('/developer', developerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/phone-auth', phoneAuthRoutes);


const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
