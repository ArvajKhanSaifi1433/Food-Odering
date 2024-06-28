import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    // Validate itemId
    if (!itemId) {
      return res.status(400).json(new ApiError(400, "Item ID is required"));
    }

    // Fetch user data
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Get and update cart data
    const cartData = (await userData.cartData) || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // Update user cart data in the database
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: { cartData } }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(500).json(new ApiError(500, "Failed to update cart"));
    }

    // Respond with updated user data
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Item added to cart"));
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    // Validate input
    if (!itemId) {
      return res.status(400).json(new ApiError(400, "Item ID is required"));
    }

    // Ensure the user is authenticated
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    // Fetch user data and update cart in one operation
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Update cart data
    const cartData = (await userData.cartData) || {};
    if (cartData[itemId] && cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    // Update user cart data in the database
    const updatedUser = await userModel
      .findByIdAndUpdate(userId, { $set: { cartData } }, { new: true })
      .select("-password");

    if (!updatedUser) {
      return res.status(500).json(new ApiError(500, "Failed to update cart"));
    }

    // Respond with updated user data
    res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Item removed from cart"));
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized"));
    }

    // Fetch user data and update cart in one operation
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    const cartData = (await userData.cartData) || {};

    res
      .status(200)
      .json(new ApiResponse(200, cartData, "Item removed from cart"));
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};

export { addToCart, removeFromCart, getCart };
