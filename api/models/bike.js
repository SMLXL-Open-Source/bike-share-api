const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    is_electric: {
        type: Boolean,
    },
    in_transit: {
        type: Boolean,
        default: false
    },
    is_available: {
        type: Boolean,
    },
}, { timestamps: true });

module.exports = Bike = mongoose.model('bikes', bikeSchema);