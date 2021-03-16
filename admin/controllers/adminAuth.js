const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminUser = require("../../models/adminUser");
const Query = require("../../models/query")

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const phone = req.body.phone;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new AdminUser({
        email:email,
        phone: phone,
        password: hashedPw,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "Admin User created!", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const phone = req.body.phone;
  const password = req.body.password;
  let loadedUser;
  AdminUser.findOne({ phone: phone })
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
          phone: loadedUser.phone,
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
  AdminUser.findById(req.userId)
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
  AdminUser.findById(req.userId)
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