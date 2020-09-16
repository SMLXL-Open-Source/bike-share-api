const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Station = require('../models/station');

/**
 * @route GET v1/stations
 * @description Get all stations
 * @access Public
 */
router.get('/', (req, res, next) => {
    Station.find().then((stations) => {
        res.status(200).json({
            stations,
            success: true
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        })
    })
});

/**
 * @route GET v1/stations/:id
 * @description Get station by id
 * @access Public
 */
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        Station.findById(id).then((station) => {
            res.status(200).json({
                station,
                success: true
            })
        })
    } else {
        return res.status(404).json({
            message: 'Station not found',
            success: false
        })
    }
})


module.exports = router;