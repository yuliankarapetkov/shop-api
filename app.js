const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const authRoutes = require('./api/routes/auth');

mongoose.connect(`mongodb://admin:${process.env.MONGO_ATLAS_PW}@shop-shard-00-00-qjun3.mongodb.net:27017,shop-shard-00-01-qjun3.mongodb.net:27017,shop-shard-00-02-qjun3.mongodb.net:27017/test?ssl=true&replicaSet=shop-shard-0&authSource=admin&retryWrites=true`);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

   if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
   }

   next();
});

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
   const error = new Error('Not found');
   error.status = 404;
   next(error);
});

app.use((err, req, res, next) => {
   res.status(err.status || 500).json({
      error: {
          message: err.message
      }
   });
});

module.exports = app;