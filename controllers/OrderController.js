const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
// Create a new order
const createOrder = async (req, res) => {
  try {
    const { firstName, lastName, email, address, phone, productId, qte } =
      req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: "12345678",
      address,
      role: "client",
    });

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const newOrder = new Order({
      userId: user._id,
      productId,
      qte,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      data: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};

// Get all orders (with pagination)
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find orders with pagination
    const orders = await Order.find()
      .populate("userId", "firstName lastName email")
      .populate("productId", "title price") // Populate product details
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page),
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message,
    });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("productId", "name price");

    if (!order || order.deletedAt !== null) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    });
  }
};

// Get orders by user ID
const getOrdersByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ userId, deletedAt: null })
      .populate("productId", "name price")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const totalOrders = await Order.countDocuments({ userId, deletedAt: null });

    res.status(200).json({
      success: true,
      count: orders.length,
      total: totalOrders,
      totalPages: Math.ceil(totalOrders / limit),
      currentPage: parseInt(page),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user orders",
      error: error.message,
    });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { qte } = req.body;
    const updates = {};

    // Only update fields that are provided
    if (qte !== undefined) updates.qte = qte;

    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found or already deleted",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params; // Get the order ID from URL params
    const { status } = req.body; // Get the status to update to from the request body

    // Validate the status
    if (!["pending", "shipped", "cancelled", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    // Find the order and update its status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    // If the order doesn't exist
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Return the updated order
    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Hard delete an order (for admins)
const DeleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order permanently deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error permanently deleting order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserId,
  updateOrder,
  DeleteOrder,
};
