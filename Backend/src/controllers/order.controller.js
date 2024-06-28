import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend

const placeOrder = async (req, res) => {
  const frontendUrl = "http://localhost:5173";
  try {
    const { items, amount, address } = req.body;

    if (items.length === 0) {
      return res
        .status(400)
        .json(
          new ApiError(400, "Please select an item or add an item to the cart.")
        );
    }

    const newOrder = await orderModel.create({
      userId: req.user?._id,
      items,
      amount,
      address,
    });

    const createdOrder = await orderModel.findById(newOrder._id);

    if (!createdOrder) {
      return res
        .status(500)
        .json(new ApiError(500, "Error creating the order"));
    }

    /*   await userModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { cartData: {} },
      },
      { new: true }
    ); */

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${createdOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${createdOrder._id}`,
    });

    res
      .status(200)
      .json(new ApiResponse(200, { session_url: session.url }, ""));
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        { $set: { payment: true } },
        { new: true }
      );

      await userModel.findByIdAndUpdate(
        updatedOrder.userId,
        {
          $set: { cartData: {} },
        },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Payment successful"));
    } else {
      const deletedOrder = await orderModel.findByIdAndDelete(orderId);

      if (!deletedOrder) {
        return res.status(404).json(new ApiError(404, "Order not found"));
      }

      return res
        .status(200)
        .json(new ApiResponse(409, {}, "Payment failed and order deleted"));
    }
  } catch (error) {
    console.error("Error verifying order:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

const userOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(400).json(new ApiError(400, "User ID is required"));
    }

    const orders = await orderModel.find({ userId });
    if (orders.length === 0) {
      return res.status(404).json(new ApiResponse(404, [], "No orders found"));
    }

    res.status(200).json(new ApiResponse(200, orders, "Orders found"));
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export { placeOrder, verifyOrder, userOrder };
