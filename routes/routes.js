const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController")
const CategoryController = require("../controllers/CategoryController")

router.post("/register" , UserController.Register)
router.post("/login" , UserController.Login)


// CATEGORY ROUTES
router.post("/categories" , CategoryController.createCategory)
router.get("/categories" , CategoryController.getCategories)
router.put("/categories/:_id" , CategoryController.updateCategory)
router.delete("/categories/:_id" , CategoryController.deleteCategory)

module.exports = router;
