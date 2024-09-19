import { Request, Response, NextFunction } from "express";

import CouponService from "../models/Coupon.service";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";

const couponService = new CouponService();

const couponController: T = {};

couponController.createCoupon = async (req: ExtendedRequest, res: Response) => {
  try {
    const newCoupon = await couponService.createCoupon(req.body);
    res.render("Coupon", { result: newCoupon });
  } catch (err) {
    console.log(err, "error");
  }
};
couponController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("Coupon");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};
export default couponController;
