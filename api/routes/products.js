const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
       message: 'Handling GET requests to /products'
    });
});

router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    };
    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    if (productId === 'special') {
        res.status(200).json({
            message: 'special'
        });
    } else {
        res.status(200).json({
            message: 'you passed an id'
        })
    }
});

router.patch('/:productId', (req, res, next) => {
   res.status(200).json({
       message: 'Updated'
   });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted'
    });
});

module.exports = router;