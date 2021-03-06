const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Post = require("../../models/post");
const User = require("../../models/user");

const Product = require("../../models/product");
const Category = require("../../models/category");

exports.createProduct = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.files) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const images = req.files.map((file) => {
    return {
      url: "images/" + new Date().toISOString() + "-" + file.originalname,
    };
  });

  const payload = {
    title: req.body.title,
    description: req.body.description,
    features: JSON.parse(req.body.features),
    images: images,
    categories: JSON.parse(req.body.categories),
  };

  const product = new Product(payload);

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product created successfully!",
        product: result,
      });
      return result;
    })
    .then((product) => {
      //save product in category

      req.body.categories &&
        req.body.categories.forEach((item) => {
          //item.cateId
          Category.findById(item.cateId).then((category) => {
            category.products.push(product._id);
            category.save();
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getProducts = async (req, res, next) => {
  // const currentPage = req.query.page || 1;
  // const perPage = 2;
  // let totalItems;
  // Post.find()
  //   .countDocuments()
  //   .then((count) => {
  //     totalItems = count;
  //     return Post.find()
  //       .skip((currentPage - 1) * perPage)
  //       .limit(perPage);
  //   })
  //   .then((posts) => {
  //     res.status(200).json({
  //       message: "Fetched posts successfully.",
  //       posts: posts,
  //       totalItems: totalItems,
  //     });
  //   })
  //   .catch((err) => {
  //     if (!err.statusCode) {
  //       err.statusCode = 500;
  //     }
  //     next(err);
  //   });

  try {
    const products = await Product.find({ active: true });

    res.status(200).json({
      message: "Fetched successfully.",
      products: products,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
    .then((product) => {
      if (!product) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ message: "Post fetched.", product });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateProduct = async (req, res, next) => {
  const productId = req.params.productId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  try{

    console.log("product[payloadKey] ", productId)

  let product = await Product.findById(productId);
  
  let payload = {
    ...(req.body.title && {title:req.body.title}),
    ...(req.body.description && {description: req.body.description}),
    ...(req.body.features && {features: JSON.parse(req.body.features)}),
    // ...(images && {b: 5}),
    ...(req.body.categories && {categories: JSON.parse(req.body.categories)}),
  }

  if("active" in req.body){
    payload.active = req.body.active
  }

 
  Object.keys(payload).forEach((payloadKey) => {
    product[payloadKey] = payload[payloadKey]; 
  });

  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Product updated successfully!",
        product: result,
        
      });
      return result;
    })
    .then((product) => {
      //save product in category

      req.body.categories &&
        req.body.categories.forEach((item) => {
          //item.cateId
          Category.findById(item.cateId).then((category) => {
            category.products.push(product._id);
            category.save();
          });
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  } catch(err){
    if (!err.statusCode) { 
      err.statusCode = 500;
    }
    next(err);
  }

};

exports.deleteProduct = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        throw error;
      }
      // Check logged in user
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
