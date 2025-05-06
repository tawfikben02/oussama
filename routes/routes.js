const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const CategoryController = require("../controllers/CategoryController");
const OrderController = require("../controllers/OrderController");
const ProductController = require("../controllers/ProductController");
const upload = require("../middlewares/multer");

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);

// CATEGORY ROUTES
router.post("/categories", CategoryController.createCategory);
router.get("/categories", CategoryController.getCategories);
router.put("/categories/:id", CategoryController.updateCategory);
router.delete("/categories/:id", CategoryController.deleteCategory);

// ORDER ROUTES
router.get("/orders", OrderController.getAllOrders);
router.get("/orders/:id", OrderController.getOrderById);
router.post("/orders", OrderController.createOrder);
router.get("/users/:userId/orders", OrderController.getOrdersByUserId);
router.put("/orders/:id", OrderController.updateOrder);

//  RRODUCT ROUTES
router.get("/products", ProductController.getAllProducts);
router.get("/products/:id", ProductController.getProductById);
router.post(
  "/products",
  upload.single("image"),
  ProductController.createProduct
);
router.put(
  "/products/:id",
  upload.single("image"),
  ProductController.updateProduct
);
router.delete("/products/:id", ProductController.deleteProduct);

module.exports = router;
