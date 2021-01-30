const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/product');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.post(
    '/product',
    isAuth,
    [
      body('title')
        .trim()
        .isLength({ min: 1 }),
    ],
    feedController.createProduct
  );

router.get('/products', isAuth, feedController.getProducts);

router.get('/product/:productId', isAuth, feedController.getProduct);

router.put(
  '/product/:prouctId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 5 }),
    body('content')
      .trim()
      .isLength({ min: 5 })
  ],
  feedController.updateProduct
);

router.delete('/product/:productId', isAuth, feedController.deleteProduct);

module.exports = router;
