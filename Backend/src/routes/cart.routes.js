import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const cartRouter = Router();

cartRouter.route("/addToCart").post(verifyJwt, addToCart);

cartRouter.route("/removeFromCart").post(verifyJwt, removeFromCart);

cartRouter.route("/getCart").post(verifyJwt, getCart);

export default cartRouter;
