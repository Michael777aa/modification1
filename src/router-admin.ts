import express from "express";
import productController from "./controllers/product.controller";
import makeUploader from "./libs/utils/uploader";
import eventController from "./controllers/event.controller";
import shopController from "./controllers/shop.controller";
import couponController from "./controllers/coupon.Controller";

const routerAdmin = express.Router();

/**  SHOP ROUTERS **/
routerAdmin.get("/", shopController.goHome);
routerAdmin.get("/check-me", shopController.checkAuthSession);

routerAdmin
  .get("/login", shopController.getLogin)
  .post("/login", shopController.processLogin);

routerAdmin
  .get("/signup", shopController.getSignup)
  .post(
    "/signup",
    makeUploader("members").single("memberImage"),
    shopController.processSignup
  );
routerAdmin.get("/logout", shopController.logout);

/** PRODUCT ROUTERS **/
routerAdmin.get(
  "/product/all",
  shopController.verifyRestaurant,
  productController.getAllProducts
);
routerAdmin.post(
  "/product/create",
  shopController.verifyRestaurant,
  makeUploader("products").array("productImages", 5),
  productController.createNewProduct
);
routerAdmin.post(
  "/product/:id",
  shopController.verifyRestaurant,
  productController.updateChosenProduct
);

/** EVENT ROUTERS **/
routerAdmin.get(
  "/event/all",
  shopController.verifyRestaurant,
  eventController.getAllEvents
);

routerAdmin.post(
  "/event/create",
  shopController.verifyRestaurant,
  makeUploader("events").array("eventImages", 5),
  eventController.createNewEvent
);

routerAdmin.post(
  "/event/:id",
  shopController.verifyRestaurant,
  eventController.updateChosenEvent
);

/** USER ROUTERS **/
routerAdmin.get(
  "/user/all",
  shopController.verifyRestaurant,
  shopController.getUsers
);
routerAdmin.post(
  "/user/edit",
  shopController.verifyRestaurant,
  shopController.updateChosenUser
);

/** COUPON ROUTERS **/
routerAdmin.post(
  "/coupanCreate",
  shopController.verifyRestaurant,
  couponController.createCoupon
);

routerAdmin.get(
  "/coupanCreate",
  shopController.verifyRestaurant,
  couponController.getAllCoupons
);
export default routerAdmin;
