const express = require('express');

const feedController = require('../controllers/common');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /feed/post
router.post(
    '/main-menu',
    isAuth,
    feedController.createMainMenu
  );

// GET /feed/posts
router.get('/main-menu', 
// isAuth, 
feedController.getMainMenu);

// POST /feed/post
router.post(
  '/category',
  isAuth,
  feedController.createCategory
);

// GET /feed/posts
router.get('/categories', 
// isAuth, 
feedController.getCategories);

router.get('/category/:cate', 
// isAuth,
 feedController.getCategory);


module.exports = router;