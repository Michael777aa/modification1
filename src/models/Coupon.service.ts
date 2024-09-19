import { CoupanInput } from "../libs/types/coupan";

import couponModel from "../schema/couponModel";

class CouponService {
  private readonly couponModel;

  constructor() {
    this.couponModel = couponModel;
  }

  public async createCoupon(couponData: CoupanInput) {
    try {
      const newCoupon = await this.couponModel.create(couponData);
      return newCoupon;
    } catch (error) {
      throw new Error(`Failed to create coupon: `);
    }
  }
}

export default CouponService;
