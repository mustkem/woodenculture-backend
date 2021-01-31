const MainMenu = require('../models/common');
const Cateory = require('../models/common');


exports.getMainMenu = (req, res, next) => {

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
