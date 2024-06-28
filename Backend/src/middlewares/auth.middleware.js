import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

dotenv.config();

const verifyJwt = async (req, res, next) => {
  try {
    // Check if authorization header is present
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(401).json(new ApiError(401, "Token is not found"));
    }

    // Extract token from authorization header
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorized request"));
    }

    // Verify token validity
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Retrieve user details from database
    const user = await userModel.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid access token"));
    }

    // Attach user object to request for further use in route handlers
    req.user = user;

    // Call next middleware or route handler
    next();
  } catch (error) {
    // Handle errors appropriately
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(401)
        .json(new ApiError(401, "Token has expired, please regenerate token"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json(new ApiError(401, "Invalid token"));
    }
    return res
      .status(error.status || 500)
      .json(
        new ApiError(
          error.status || 500,
          error.message || "Internal Server Error"
        )
      );
  }
};

export { verifyJwt };
