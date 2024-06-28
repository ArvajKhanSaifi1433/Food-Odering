import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addFood,
  getFoodList,
  removeFood,
} from "../controllers/food.controller.js";

const foodRouter = Router();

foodRouter.route("/addFood").post(upload.single("image"), addFood);

foodRouter.route("/getFoodList").get(getFoodList);

foodRouter.route("/removeFood/:_id").delete(removeFood);

export default foodRouter;
