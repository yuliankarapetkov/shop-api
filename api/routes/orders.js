const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, (req, res, next) => {
    Order.find()
        .select('-__v')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', checkAuth, (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .exec()
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    error: 'Product Not Found'
                });
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            return order.save();
        })
        .then(doc => {
            res.status(201).json(doc)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;

    Order.findById(id)
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    error: 'Order Not Found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    const id = req.params.orderId;

    Order.findOneAndRemove({ _id: id })
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({
                    error: 'Order Not Found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

module.exports = router;