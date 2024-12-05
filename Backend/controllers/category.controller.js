import { Category } from "../models/category.model.js";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { categoryname } = req.body;


    if (!categoryname) {
      return res.status(400).json({
        message: "Category name is required.",
        success: false,
      });
    }

    const category = await Category.create({ categoryname });

    res.status(201).json({
      message: "Category created successfully.",
      success: true,
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories.length) {
      return res.status(404).json({
        message: "No categories found.",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const { cid } = req.params;

    const category = await Category.findByIdAndDelete(cid);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const { cid } = req.params;
    const { categoryname } = req.body;
    console.log(categoryname);
    

    if (!categoryname) {
      return res.status(400).json({
        message: "Category name is required.",
        success: false,
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      cid,
      { categoryname },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};
