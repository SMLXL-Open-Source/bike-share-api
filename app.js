const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require("passport");
require('dotenv').config();

const port = process.env.PORT || 5000;

// Bring in routes
const userRoutes = require('./api/routes/users');

if (process.env.ENVIRONMENT == "production") {
    mongoose.connect(process.env.MONGO_PROD, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log(`${process.env.MONGO_PROD} was successfully connected`);
    }).catch(err => {
        console.log(err)
    })
} else {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log(`${process.env.MONGO_URI} was successfully connected`);
    }).catch(err => {
        console.log(err)
    })
}

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
// Use passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Bring in passport strategy 
require("./api/middleware/passport")(passport);

// Routes
app.get('/', (req, res, next) => {
    res.send(`Server is running on port ${port}`);
});
app.use('/v1/users', userRoutes);

app.listen(port, (req, res) => {
    console.log(`Server is listening to port ${port}`)
});