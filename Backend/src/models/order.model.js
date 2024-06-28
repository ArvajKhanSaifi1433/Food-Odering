import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    items: {
      type: Array,
      required: [true, "items is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    address: {
      type: Object,
      required: [true, "address is required"],
    },
    status: {
      type: String,
      default: "Food Processing",
    },
    data: {
      type: Date,
      default: Date.now(),
    },
    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
