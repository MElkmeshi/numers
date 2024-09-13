import mongoose from "mongoose";

const phoneNumberSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    names: { type: Array, required: true },
  },
  {
    timestamps: true,
  }
);

const PhoneNumber = mongoose.model("phoneNumber", phoneNumberSchema);
export default PhoneNumber;
