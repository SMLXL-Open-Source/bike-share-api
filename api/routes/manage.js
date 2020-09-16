const express = require('express');
const router = express.Router();
const passport = require('passport');
const Bike = require('../models/bike');
const mongoose = require('mongoose');
const user = require('../models/user');

/**
 * @route POST v1/manage/bike
 * @description Add a bike
 * @access Private
 */

router.post('/bikes/create', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const isAdmin = req.user.isAdmin;
    let {
        name,
        is_electric,
        is_available
    } = req.body
    if (!isAdmin) {
        res.status(401).json({
            message: 'Not Authorized',
            success: false
        })
    } else {
        try {
            const newBike = new Bike({
                _id: new mongoose.Types.ObjectId(),
                name,
                is_electric,
                is_available
            });
            console.log(newBike);
            newBike.save().then((bike) => {
                res.status(201).json({
                    bike,
                    message: 'Bike added successfully',
                    success: true
                })
            });
        } catch (error) {
            res.status(500).json({
                error: error,
                success: false
            })
        }
    }
})

/**
 * @route PUT v1/manage
 * @description update existing bike
 * @access Private
 */

router.patch('/bike/update/:id', passport.authenticate('jwt', { session: false }), async(req, res, next) => {
    try {
        let id = req.params.id;
        if (mongoose.Types.ObjectId.isValid(id)) {
            let updates = req.body;

            await Bike.findByIdAndUpdate(id, updates).then((bike) => {
                res.status(200).json({
                    bike,
                    message: 'Bike successfully updated',
                    success: true
                })
            })
        } else {
            res.status(404).json({
                message: 'Bike not found',
                success: false
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
            success: false
        })
    }
})

module.exports = router;