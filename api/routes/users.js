const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const { EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_USERNAME, EMAIL_SMTP_PASSWORD, JWT_KEY } = require('../config/keys');

// config nodemailer transport

const transporter = nodemailer.createTransport({
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    // secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
    auth: {
        user: EMAIL_SMTP_USERNAME,
        pass: EMAIL_SMTP_PASSWORD,
    },
});

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
                            optPin: crypto.randomBytes(2).toString("hex"),
                        });
                        newUser
                            .save()
                            .then((user) => {
                                const message = {
                                    from: "hello@khabubundivhu.co.za",
                                    to: user.email,
                                    subject: "Bike Share - Verify Your Account",
                                    html: `
                                    <h3>Hi ${user.last_name} ${user.first_name}</h3>
                                    <p>Thank you for creating an account on Bike Share</p>
                                    <p>Please use the opt below to verify your account</p>
                                    <h5>${user.optPin}</h5>
                                    <a href="">Account verification link</a>
                                `,
                                };
                                transporter.sendMail(message, function(error, info) {
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log("Email sent", info.response);
                                    }
                                });
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
                    message: "Authentication failed",
                    success: false,
                });
            }
            bcrypt.compare(req.body.password, user.password).then((isMatch) => {
                if (!isMatch) {
                    res.status(404).json({
                        message: "Authentication failed",
                        success: false,
                    });
                } else {
                    const token = jwt.sign({
                            userId: user._id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                        },
                        JWT_KEY, {
                            expiresIn: "72h",
                        }
                    );
                    res.status(200).json({
                        user,
                        token: token,
                        message: "User successfully authenticated",
                        success: true,
                    });
                }
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
                success: false,
            });
        });
});

/**
 * @route GET: v1/users/profile
 * @description get users details
 * @access Private
 */

router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res, next) => {
        return res.json({
            user: req.user,
        });
    }
);

module.exports = router;