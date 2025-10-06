import mongoose from "mongoose";

const supportSchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: [true, "Query is required"],
      trim: true,
    },
    senderId: {
      type: String,
      required: [true, "Sender ID is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt
  }
);

const Support = mongoose.model("Support", supportSchema);

export default Support;
