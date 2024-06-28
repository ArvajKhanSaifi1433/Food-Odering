import foodModel from "../models/food.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (
      [name, description, price, category].some((item) => item === undefined) ||
      [name, description, price, category].some((item) => item?.trim() === "")
    ) {
      return res.status(400).json(new ApiError(400, "All Fields are Required"));
    }

    const foodImageLocalPath = req.file?.path;

    if (!foodImageLocalPath) {
      return res.status(400).json(new ApiError(400, "image is missing"));
    }

    const imageUrl = await uploadOnCloudinary(foodImageLocalPath);

    if (!imageUrl?.url) {
      return res
        .status(400)
        .json(new ApiError(400, "Error while uploading on image"));
    }

    const food = await foodModel.create({
      name,
      description,
      price,
      image: imageUrl?.url || "",
      category,
    });

    const createdFood = await foodModel.findById(food._id);

    if (!createdFood) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong while registering the user")
        );
    }

    res
      .status(200)
      .json(new ApiResponse(200, createdFood, "Food successfully added"));
  } catch (error) {
    
    res.status(500).json(new ApiError(500));
  }
};

const getFoodList = async (req, res) => {
  try {
    const foodList = await foodModel.find();
    res
      .status(200)
      .json(new ApiResponse(200, foodList, "All food get successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500));
  }
};

const removeFood = async (req, res) => {
  try {
    const { _id } = req.params;

    const removeFoodItem = await foodModel.findByIdAndDelete(_id);

    if (!removeFoodItem) {
      return res
        .status(400)
        .json(new ApiError(400, "Food item is not removed , your id is wrong"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, removeFoodItem, "Food item is remove successfully")
      );
  } catch (error) {
    res.status(500).json(new ApiError(500));
  }
};

export { addFood, getFoodList, removeFood };
