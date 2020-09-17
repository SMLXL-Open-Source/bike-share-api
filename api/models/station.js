const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const geocoder = require('../utils/geocoder');

const stationSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String
    },
    address: {
        type: String,
    },
    location: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    formattedAddress: String,
    available_bikes: [{
        bikeId: mongoose.Types.ObjectId
    }]
}, { timestamps: true });

// Geocoder & create location
stationSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
    };
    this.formattedAddress = loc[0].formattedAddress
        // Do not save address
    this.address = undefined;
    next();
})

module.exports = Station = mongoose.model('stations', stationSchema);