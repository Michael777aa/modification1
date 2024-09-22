import express from "express";
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";
import eventController from "./controllers/event.controller";
import couponController from "./controllers/coupon.Controller";
const router = express.Router();

/** Member **/
router.get("/member/restaurant", memberController.getRestaurant);
router.post("/member/signup", memberController.signup);
router.post("/member/login", memberController.login);

router.post(
  "/member/logout",
  memberController.verifyAuth,
  memberController.logout
);
router.get(
  "/member/detail",
  memberController.verifyAuth,
  memberController.getMemberDetail
);

router.post(
  "/member/update",
  memberController.verifyAuth,
  uploader("members").single("memberImage"),
  memberController.updateMember
);

/** Product **/
router.get("/member/top-users", memberController.getTopUsers);
router.get("/product/all", productController.getProducts);
router.get("/event/all", eventController.getEvents);

router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct
);

/** Order **/
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder
);
router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder
);

/** Coupon **/
router.post(
  "/coupon/verify",
  memberController.verifyAuth,
  couponController.verifyCoupon
);

export default router;
