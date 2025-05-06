const Category = require("../models/Category");

const createCategory = async (req, res) => {
  try {
    const { title, description } = req.body;
    const category = await Category.create({ title, description });
    return res
      .status(200)
      .json({ message: "Category created Successfully ", category });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return res.status(200).json({ categories });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateCategoryData = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateCategoryData,
      { new: true }
    );

    res.status(200).json({ message: "updated successfully ", updatedCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    return res.status(200).json({ message: "houwa hadak rah tms7" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
