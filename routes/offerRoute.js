import express from "express";
import {
  createOfferController,
  getHighestDiscountController,
} from "../controllers/offerController.js";

const router = express.Router();

router.post("/offer", createOfferController);
router.get("/highest-discount", getHighestDiscountController);

export default router;
