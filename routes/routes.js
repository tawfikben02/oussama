const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const OrderController = require("../controllers/OrderController");
const ProductController = require("../controllers/ProductController");
const upload = require("../middlewares/multer");

router.post("/register", UserController.Register);
router.post("/login", UserController.Login);

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
