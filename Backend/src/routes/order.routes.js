import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  placeOrder,
  userOrder,
  verifyOrder,
} from "../controllers/order.controller.js";

const orderRouter = Router();

orderRouter.route("/placeOrder").post(verifyJwt, placeOrder);
orderRouter.route("/verifyOrder").post(verifyOrder);
orderRouter.route("/userOrders").post(verifyJwt, userOrder);

export default orderRouter;
