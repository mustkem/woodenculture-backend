const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Query = require("../models/query")

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const phone_num = req.body.phone_num;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        phone_num: phone_num,
        password: hashedPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const phone_num = req.body.phone_num;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ phone_num: phone_num })
    .then((user) => {
      if (!user) {
        const error = new Error("A user could not be found.");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Wrong password!");
        error.statusCode = 401;  
        throw error;
      }
      const token = jwt.sign(
        {
          phone_num: loadedUser.phone_num,
          userId: loadedUser._id.toString(),
        },
        "somesupersecretsecret",
        { expiresIn: "1h" }
      );
      res
        .status(200)
        .json({
          token: token,
          userId: loadedUser._id.toString(),
          user: loadedUser,
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status, user });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const newStatus = req.body.user;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "User updated." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateWishlist = (req, res, next) => {
  const productId = req.query.productId;
  const status = req.query.status;

  const wishlistData = {
    productId,
    status,
  };

  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }
      const wishlistIndex = user.wishlist.findIndex(
        (item) => item.productId == productId
      );

      if (wishlistIndex === -1) {
        user.wishlist.push(wishlistData);
      } else {
        user.wishlist[wishlistIndex] = wishlistData;
      }

      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Wishlist updated." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};




exports.getWishlist = (req, res, next) => {

  User.findById(req.userId)
    .populate({ 
      path: 'wishlist',
      populate: {
        path: 'productId',
        model: 'Product'
      } 
   })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ products: user.wishlist });

      return user.save();
    })
    
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};


exports.addQuery = (req, res, next) => {

  const payload = {
    note: req.body.note,
    product: req.body.productId,
    phoneNum:req.body.phoneNum,
    user: req.userId,
    type: req.body.type
  };

  const query = new Query(payload);

  query
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Added successfully!',
      });
      return result;
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getQueries = (req, res, next) => {

  Query.find()
    .populate( {
      path: 'product',
      model: 'Product'
    })
    .populate({
      path: 'user',
      model: 'User'
    })
    .then((queries) => {
      if (!queries) {
        const error = new Error("User not found.");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ queries });

      return user.save();
    })
    
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};