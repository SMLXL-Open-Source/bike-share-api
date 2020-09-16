const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    available_bikes: [{
        bikeId: mongoose.Types.ObjectId
    }]
}, { timestamps: true });

module.exports = Station = mongoose.model('stations', stationSchema);