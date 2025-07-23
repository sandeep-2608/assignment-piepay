import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  flipkartOfferId: { type: String, required: true },
  bankName: { type: String, required: true },
  paymentInstruments: [{ type: String }],
  offerTitle: { type: String },
  offerDescription: { type: String },
  tnc: { type: String },
  offerType: { type: String },
  discountType: { type: String, required: true },
  discountValue: { type: Number, required: true },
  minAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  validity: {
    start: Date,
    end: Date,
  },
  createdAt: { type: Date, default: Date.now },
});

// composite index
offerSchema.index({
  bankName: 1,
  discountType: 1,
  discountValue: 1,
  paymentInstruments: 1,
});

export default mongoose.model("Offer", offerSchema);
