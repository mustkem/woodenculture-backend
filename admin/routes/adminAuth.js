const express = require('express');
const { body } = require('express-validator/check');

const AdminUser = require('../../models/adminUser');
const adminAuthController = require('../controllers/adminAuth');
const isAuth = require('../../middleware/is-auth');

const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return AdminUser.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('phone')
      .trim()
      .isLength({ min: 10, max:10 }),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  adminAuthController.signup
);

router.post('/login', adminAuthController.login);

// router.get('/status', isAuth, authController.getUserStatus);

// router.patch(
//   '/user/update',
//   isAuth,
//   authController.updateUser
// );

// router.patch(
//   '/user/wishlist',
//   isAuth,
//   authController.updateWishlist
// );

// router.get(
//   '/user/wishlist',
//   isAuth,
//   authController.getWishlist
// );


// router.post(
//   '/user/query',
//   authController.addQuery
// );

// router.get(
//   '/user/queries',
//   isAuth,
//   authController.getQueries
// );


module.exports = router;
