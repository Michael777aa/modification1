import { Request, Response } from "express";
import CouponService from "../models/Coupon.service";
import { T } from "../libs/types/common";
import { AdminRequest } from "../libs/types/member";
import Errors from "../libs/Error";

const couponService = new CouponService();
const couponController: T = {};

// couponController.getCoupon = (req: AdminRequest, res: Response) => {
//   try {
//     console.log("getCoupon");
//     res.render("Coupon", { result: null });
//   } catch (err) {
//     console.log("Error, getCoupon:", err);
//   }
// };

couponController.getAllCoupons = async (req: Request, res: Response) => {
  try {
    console.log("getAllCoupons");
    const data = await couponService.getAllCoupons();
    res.render("Coupon", { coupons: data });
  } catch (err) {
    console.log("Error, getAllCoupons", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};
couponController.createCoupon = async (req: AdminRequest, res: Response) => {
  try {
    // Validate if necessary fields exist
    const { name, expiry, discount } = req.body;
    if (!name || !expiry || !discount) {
      throw new Error("All fields are required: name, expiry, discount");
    }

    // Pass data to the service for creation
    const newCoupon = await couponService.createCoupon(req.body);

    // Render the view with the result
    res.send(
      `<script> alert("Sucessfully creation!"); window.location.replace('/admin/coupanCreate');</script>`
    );
  } catch (err) {
    console.log("Error creating coupon:", err); // Log the error
    res.render("Coupon", { result: null }); // Send error to view
  }
};

export default couponController;
