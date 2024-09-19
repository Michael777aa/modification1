import { Request, Response, NextFunction } from "express";

import CouponService from "../models/Coupon.service";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";

const couponService = new CouponService();

const couponController: T = {};

couponController.getCoupon = (req: Request, res: Response) => {
  try {
    console.log("getCoupon");
    res.render("Coupon");
  } catch (err) {
    console.log("Error, getCoupon:", err);
  }
};

couponController.createCoupon = async (req: ExtendedRequest, res: Response) => {
  try {
    const newCoupon = await couponService.createCoupon(req.body);
    res.render("Coupon", { result: newCoupon || null });
  } catch (err) {
    console.log(err, "error");
  }
};

export default couponController;
