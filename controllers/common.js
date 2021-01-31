const MainMenu = require('../models/mainMenu');
const Cateory = require('../models/category');
const Product = require('../models/product');



exports.getMainMenu = (req, res, next) => {
  console.log("test",MainMenu)
  MainMenu.find()
    .then(response => {
      res.status(200).json({
        message: 'Fetched menu.',
        mainMenu:response,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.createMainMenu = (req, res, next) => {
  const payload = {
    title: req.body.title,
    cateId:req.body.cateId,
    categories: req.body.categories,
  };
  const mainMenu = new MainMenu(payload);
  mainMenu
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Menu created successfully!',
        mainMenu: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};


exports.createCategory = (req, res, next) => {
  const payload = {
    title: req.body.title,
    products:req.body.products,
  };
  const category = new Cateory(payload);
  category
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Category created successfully!',
        category: result,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

};

exports.getCategories = (req, res, next) => {
  Cateory.find()
    .then(response => {
      res.status(200).json({
        message: 'Fetched category.',
        categories:response,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.getCategory = (req, res, next) => {
  const cate = req.params.cate;
  Cateory.findOne({value: cate})
    .populate("products")
    .then(category => {
      if (!category) {
        const error = new Error('Could not find.');
        error.statusCode = 404;
        throw error;
      }
      
      res.status(200).json({ message: 'Products fetched.', products: category.products });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
