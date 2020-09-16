const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Bike = require('../models/bike');

/**
 * @route GET v1/bikes
 * @description Get all bikes
 * @access Public
 */
router.get('/', (req, res, next) => {
    Bike.find().then((bikes) => {
        res.status(200).json({
            bikes,
            success: true
        })
    }).catch(error => {
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        })
    });
});

/**
 * @route GET v1/bikes/:id
 * @description Get bike by id
 * @access Public
 */
router.get('/:id', (req, res, next) => {
    let id = req.params.id;
    Bike.findById({ _id: id }).then((bike) => {
        res.status(200).json({
            bike,
            success: true
        })
    }).catch(error => {
        res.status(404).json({
            message: 'Bike not found',
            success: false
        })
    })
})

module.exports = router;