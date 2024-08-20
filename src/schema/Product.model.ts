import mongoose, { Schema } from "mongoose";
import { ProductCollection, ProductStatus } from "../libs/enums/product.enum";

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

    productLeftCount: {
      type: Number,
      required: true,
    },

    productAuthor: {
      type: String,
      required: true,
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

    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt, updateAt
);

productSchema.index(
  { productName: 1, productSize: 1, productVolume: 1 },
  { unique: true }
);

export default mongoose.model("product", productSchema);
