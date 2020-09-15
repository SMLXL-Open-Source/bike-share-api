const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/user");
require('dotenv').config();
const key = "small-medium-long-bike-share-key";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, (jwtPayload, done) => {
            User.findById(jwtPayload.userId).then(user => {
                if (user) return done(null, user);
                return done(null, false);
            }).catch((err) => console.log(err));
        })
    );
};