import mongoose from 'mongoose'
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Price cannot be negative
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // References the Categories collection
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Quantity cannot be negative
    },
    image: {
      type: String,
      required: true, // Ensure every product has an image
    },
    shipping: {
      type: Boolean,
      default: false, // Default is no shipping required
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);


