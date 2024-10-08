import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
} from "../libs/enums/product.enum";

// Schema first & Code

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },

    productPrice: {
      type: Number,
      required: true,
    },
    productSalePrice: {
      type: Number,
    },

    productLeftCount: {
      type: Number,
      required: true,
    },

    productSize: {
      type: String,
      enum: ProductSize,
      default: ProductSize.FirstClass,
    },
    productSold: {
      type: Number,
      default: 0,
    },

    productSale: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    productDesc: {
      type: String,
      required: true,
    },

    productImages: {
      type: [String],
      required: true,
      default: [],
    },
  },
  { timestamps: true } // createdAt, updateAt
);

productSchema.index({ productName: 1, productSize: 1 }, { unique: true });

export default mongoose.model("product", productSchema);
