import validator from "validator";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      [name, email, password].some((item) => item === undefined) ||
      [name, email, password].some((item) => item?.trim() === "")
    ) {
      return res.status(400).json(new ApiError(400, "All Fields are Required"));
    }

    const existedUser = await userModel.findOne({
      $and: [{ name }, { email }],
    });

    if (existedUser) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            "User with name or email already exists , please login here... "
          )
        );
    }

    const existedUserEmail = await userModel.findOne({ email });

    if (existedUserEmail) {
      return res
        .status(409)
        .json(new ApiError(409, "User with email already exists in DB "));
    }

    const existedUserName = await userModel.findOne({ name });

    if (existedUserName) {
      return res
        .status(409)
        .json(new ApiError(409, "User with name already exists in DB"));
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json(new ApiError(400, "Please Enter Valid email"));
    }

    const createdUser = await userModel.create({
      name,
      email,
      password,
    });

    const user = await userModel.findById(createdUser._id).select("-password");

    if (!user) {
      return res
        .status(500)
        .json(
          new ApiError(500, "Something went wrong while registering the user")
        );
    }

    const token = user.generateAccessToken();

    res
      .status(201)
      .json(
        new ApiResponse(200, { user, token }, "user successfully register")
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || email?.trim() === "") {
      return res.status(400).json(new ApiError(400, "Email is required"));
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json(new ApiError(400, "User is not Found"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(400).json(new ApiError(400, "password is incorrect"));
    }

    const loggedInUser = await userModel.findById(user._id).select("-password");

    const token = loggedInUser.generateAccessToken();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, token },
          "user logged in successfully"
        )
      );
  } catch (error) {
    res.status(500).json(new ApiError(500));
  }
};

const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, req.user, "User logged Out successfully"));
  } catch (error) {
    res.status(500).json(new ApiError(500));
  }
};

export { registerUser, loginUser, logoutUser };
