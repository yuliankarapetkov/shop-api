const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            User.find({ email: req.body.email })
                .exec()
                .then(user => {
                   if (user.length > 0) {
                        return res.status(409).json({
                            error: 'Email already exists'
                        })
                   } else {
                       const user = new User({
                           _id: new mongoose.Types.ObjectId(),
                           email: req.body.email,
                           password: hash
                       });

                       user.save()
                           .then(doc => res.status(201).json(doc))
                           .catch(err => res.status(500).json({ error: err }));
                   }
                });
        }
    });
});

router.post('/login', (req, res, next) => {
   User.find({ email: req.body.email })
       .exec()
       .then(user => {
           if (user.length < 1) {
               return res.status(401).json({
                   message: 'Auth failed'
               });
           }

           bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }

                if (result) {
                    const token = jwt.sign(
                        {
                            _id: user[0]._id,
                            email: user[0].email
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '1h'
                        }
                    );

                    res.status(200).json({
                        message: 'Auth successful',
                        token: token
                    });
                } else {
                    res.status(401).json({
                        message: 'Auth failed'
                    });
                }
           });
       })
       .catch(err => {
           res.status(500).json({
               error: err
           });
       });
});

module.exports = router;