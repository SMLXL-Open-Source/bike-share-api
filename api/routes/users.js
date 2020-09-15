const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const User = require("../models/user");

/**
 * @route POST v1/users/signup
 * @desc Sign up user
 * @access public
 */
router.post("/signup", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (user) {
                return res.status(409).json({
                    message: "Email already taken",
                    success: false,
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                            success: false,
                        });
                    } else {
                        const newUser = new User({
                            _id: new mongoose.Types.ObjectId(),
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            password: hash,
                        });
                        newUser
                            .save()
                            .then((user) => {
                                res.status(201).json({
                                    message: "User successfully created",
                                    user,
                                    success: true,
                                });
                            })
                            .catch((err) => {
                                res.status(500).json({
                                    error: err,
                                    success: false,
                                });
                            });
                    }
                });
            }
        });
});

/**
 * @route v1/users/login
 * @description POST login user
 * @access public
 */
router.post("/login", (req, res, next) => {
    User.findOne({ email: req.body.email })
        .exec()
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: 'Authentication failed',
                    success: false
                });
            }
            bcrypt.compare(req.body.password, user.password).then((isMatch) => {
                if (!isMatch) {
                    res.status(404).json({
                        message: 'Authentication failed',
                        success: false
                    });
                } else {
                    const token = jwt.sign({
                        userId: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }, process.env.JWT_KEY, {
                        expiresIn: "72h"
                    });
                    res.status(200).json({
                        user,
                        token: token,
                        message: 'User successfully authenticated',
                        success: true
                    })
                }
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                success: false
            })
        });
});

module.exports = router;