import mongoose, { Schema } from "mongoose";
import { EventStatus } from "../libs/enums/event.enum";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: Index to ensure unique event names and topics

export default mongoose.model("Coupon", couponSchema);
//
