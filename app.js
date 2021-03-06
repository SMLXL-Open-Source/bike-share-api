const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const passport = require("passport");
const { PORT, MONGO_URI, MONGO_PROD, ENVIRONMENT } = require('./api/config/keys')

const port = process.env.PORT || 5000;

// Bring in routes
const userRoutes = require('./api/routes/users');
const manageRouter = require('./api/routes/manage');
const bikeRouter = require('./api/routes/bikes');
const stationRouter = require('./api/routes/stations');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Connect Db
mongoose.connect(MONGO_PROD, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log(`${MONGO_PROD} was successfully connected`);
}).catch(err => {
    console.log(MONGO_PROD)
    console.log(err)
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
// Use passport middleware
app.use(passport.initialize());
// Bring in passport strategy 
require("./api/middleware/passport")(passport);

// Routes
app.get('/', (req, res, next) => {
    res.send(`Server is running on port ${port}`);
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/manage', manageRouter);
app.use('/api/v1/bikes', bikeRouter);
app.use('/api/v1/stations', stationRouter);

app.listen(port, (req, res) => {
    console.log(`Server is listening to port ${port}`)
});