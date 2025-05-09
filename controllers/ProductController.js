const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");
// Create a new product
const createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!title || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide title and price",
      });
    }

    const newProduct = new Product({
      title,
      description,
      price,
      image: image || "profile_default.png",
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// Get all products (with pagination and filters)
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      minPrice,
      maxPrice,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = { deletedAt: null };

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Price range filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Find products with pagination and sorting
    const products = await Product.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      deletedAt: null,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    let image = req.file ? req.file.filename : null;

    // If a new image is uploaded, remove the old one
    if (image && product.image) {
      const oldImagePath = path.resolve(__dirname, "../uploads", product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    product.title = title;
    product.description = description;
    product.price = price;
    product.image = image;

    await product.save();

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Hard delete a product (for admins)
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct?.image) {
      const filePath = path.resolve(
        __dirname,
        "../uploads",
        deletedProduct?.image
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error permanently deleting product",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
