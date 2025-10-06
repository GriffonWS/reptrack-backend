import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    equipmentName: { type: String, required: true },
    category: { type: String },
    equipmentNumber: { type: String, required: true, unique: true },
    equipmentImage: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;
