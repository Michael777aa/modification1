import Errors from "../libs/Error";
import { Coupan, CoupanInput } from "../libs/types/coupan";

import couponModel from "../schema/couponModel";
import { HttpCode } from "../libs/Error";
import { Message } from "../libs/Error";

class CouponService {
  private readonly couponModel;

  constructor() {
    this.couponModel = couponModel;
  }
  public async createCoupon(couponData: CoupanInput) {
    try {
      // Log the data being sent for better debugging
      console.log("Coupon data received:", couponData);
      const newCoupon = await this.couponModel.create(couponData);
      return newCoupon;
    } catch (error) {
      console.error("Error in createCoupon:", error);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async getAllCoupons(): Promise<Coupan[]> {
    const result = await this.couponModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }
}

export default CouponService;
