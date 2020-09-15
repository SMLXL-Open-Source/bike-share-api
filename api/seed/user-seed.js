const mongoose = require('mongoose');
const { exit } = require('process');
const User = require('../models/user');

var users = [
    new User({
        first_name: 'BikeShare',
        last_name: 'Administrator',
        email: 'admin@bike-share.com',
        password: 'Khabuza@1',
        isAdmin: true,
    }),
    new User({
        first_name: 'BikeShare',
        last_name: 'Moderator',
        email: 'admin@bike-share.com',
        password: 'Khabuza@1',
        isModerator: true,
    })
];

var done = 0
for (var i = 0; i < users.length; i++) {
    users[i].save(function(err, result) {
        if (done === users.length) {
            mongoose.disconnect();
        }
    });
}