const fs = require("fs");
const path = require("path");

const { validationResult } = require("express-validator/check");

const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = async (req, res, next) => {
  const category_slug = req.query.category_slug;

  try {
    const category = await Category.findOne({ value: category_slug });

    const products = await Product.find({ active: true });

    const updatedProducts = [];

    products.forEach((productItem) => {
      productItem.categories.forEach((cateItem) => {
        console.log(cateItem.cateId, category._id);
        if (cateItem.cateId == category._id) {
          updatedProducts.push(productItem);
        }
      });
    });

    res.status(200).json({
      message: "Fetched successfully.",
      products: updatedProducts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

