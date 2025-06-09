import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { User } from "../models/user.model.js";

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, shipping, categoryId } =
      req.body;
    const image = req.file;
    console.log(
      name,
      description,
      price,
      quantity,
      shipping,
      categoryId,
      image
    );
    // Validate fields
    if (!name || !description || !price || !quantity || !categoryId) {
      return res.status(400).json({
        message: "Please provide all required fields.",
        success: false,
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Please provide a product image.",
        success: false,
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
        success: false,
      });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await uploadMedia(image.path);
    if (!cloudinaryResponse) {
      return res.status(400).json({
        message: "Error uploading image to Cloudinary.",
        success: false,
      });
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      quantity,
      shipping: shipping || false,
      category: categoryId,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    res.status(201).json({
      message: "Product added successfully.",
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(12);

    if (products.length === 0) {
      return res.status(200).json({
        message: "No Products available.",
        success: true,
      });
    }
    res.status(200).json({
      success: true,
      products,
      totalCount: products.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const getPaginatedProducts = async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = {
      name: { $regex: search, $options: "i" },
    };
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    const hasMore = page * limit < total;

    res.status(200).json({
      success: true,
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      hasMore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await Product.findById(pid).populate("category");
    if (!product) {
      return res.status(200).json({
        message: "Product not found.",
        success: true,
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        message: "Product not Found.",
        success: false,
      });
    }
    if (product.image.public_id) {
      await deleteMediaFromCloudinary(product.image.public_id);
    }

    await Product.findByIdAndDelete(pid);
    res.status(200).json({
      message: "Product deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    const { name, description, price, quantity, shipping, categoryId } =
      req.body;
    const image = req.file;

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (quantity) product.quantity = quantity;
    if (shipping !== undefined) product.shipping = shipping;
    if (categoryId) product.category = categoryId;

    // Upload and update image if provided
    if (image) {
      //firstly delete image that is store in cloudinary
      await deleteMediaFromCloudinary(product.image.public_id);
      // uplaod new image
      const cloudinaryResponse = await uploadMedia(image.path);
      if (!cloudinaryResponse) {
        return res.status(400).json({
          message: "Error uploading image to Cloudinary.",
          success: false,
        });
      }
      product.image = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Product updated successfully.",
      success: true,
      product,
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

export const getRelatedProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    // const { page = 1, limit = 5 } = req.query;

    // Find the product by its ID
    const product = await Product.findById(pid);
    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    // const totalProducts = await Product.countDocuments({
    //   _id: { $ne: pid },
    //   category: product.category,
    // });

    const products = await Product.find({
      _id: { $ne: pid },
      category: product.category,
    });
    // .skip((page - 1) * limit)
    // .limit(Number(limit));

    return res.status(200).json({
      message: "Related products fetched successfully.",
      success: true,
      data: products,
      // pagination: {
      //   totalProducts,
      //   currentPage: Number(page),
      //   totalPages: Math.ceil(totalProducts / limit),
      // },
    });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({
      message: "Internal server error.",
      error: error.message,
      success: false,
    });
  }
};


// wiselist product
export const addWishlist = async (req, res) => {
  try {
    const { pid } = req.params; // Product ID
    const userId = req.user._id; // User ID from authenticated user

    // Find the user and the product
    const user = await User.findById(userId);
    const product = await Product.findById(pid);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
        success: false,
      });
    }

    // Check if the product is already in the wishlist
    const alreadyInWishlist = user.wishlist.includes(pid);
    if (alreadyInWishlist) {
      return res.status(400).json({
        message: "Product already in wishlist.",
        success: false,
      });
    }

    // Add product to wishlist and save the user
    user.wishlist.push(product._id);
    await user.save();

    res.status(200).json({
      message: "Product added to wishlist successfully.",
      success: true,
      wishlist: user.wishlist, // Returning the updated wishlist
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const getAllWiseListProduct = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user and populate the wishlist field
    const user = await User.findById(userId)
      .select("wishlist")
      .populate("wishlist");

    if (!user || user.wishlist.length === 0) {
      return res.status(200).json({
        message: "No products available in the wishlist.",
        success: true,
        wishlist: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Wishlist products retrieved successfully.",
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { pid } = req.params; // Product ID from request params
    const userId = req.user._id; // Authenticated user's ID

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Check if the product exists in the wishlist
    const productIndex = user.wishlist.indexOf(pid);
    if (productIndex === -1) {
      return res.status(404).json({
        message: "Product not found in wishlist.",
        success: false,
      });
    }

    // Remove the product from the wishlist
    user.wishlist.splice(productIndex, 1);
    await user.save();

    res.status(200).json({
      message: "Product removed from wishlist.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: error.message,
    });
  }
};
