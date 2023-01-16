const express = require('express');
const connectToDb = require('./config/connectToDb');
const xss = require('xss-clean')
const rateLimiting = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
require('dotenv').config();
const cors = require('cors')
const authRoute = require('./routes/authRoute');
const usersRoute = require('./routes/usersRoute');
const postsRoute = require('./routes/postsRoute');
const commentsRoute = require('./routes/commentsRoute');
const categoriesRoute = require('./routes/categoriesRoute');
const { errorHandler, notFound } = require('./middlewares/error');

// connect to db
connectToDb();

// initial app
const app = express();

// middlewares 
app.use(express.json());

// security headers(helmet)
app.use(helmet());

//prevent http param polution
app.use(hpp());

// prevent xss (cross sites scripting attack)
app.use(xss());

// rate limiting middlewares
app.use(rateLimiting({
    windowMs: 10*60*1000,// 10 minutes
    max:200
}));

// cors policy
app.use(cors({
    origin:"http://localhost:3000"
}));

// routes 
app.use('/api/auth',authRoute);
app.use('/api/users',usersRoute);
app.use('/api/posts',postsRoute);
app.use('/api/comments',commentsRoute);
app.use('/api/categories',categoriesRoute);

// error handler midlleware
app.use(notFound);
app.use(errorHandler);

// run server
const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV}`);
});