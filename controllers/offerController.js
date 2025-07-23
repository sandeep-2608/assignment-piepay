import offerModel from "../models/offerModel.js";

export const createOfferController = async (req, res) => {
  try {
    const { flipkartOfferApiResponse } = req.body;
    const offers = extractOffers(flipkartOfferApiResponse);

    let newOffersCreated = 0;
    for (const offer of offers) {
      const duplicate = await offerModel.findOne({
        bankName: offer.bankName,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        paymentInstruments: { $all: offer.paymentInstruments },
      });

      if (!duplicate) {
        await offerModel.create(offer);
        newOffersCreated++;
      }
    }

    res.status(201).json({
      success: true,
      noOfOffersIdentified: offers.length,
      noOfNewOffersCreated: newOffersCreated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

function extractOffers(flipkartResp) {
  if (!flipkartResp || !flipkartResp.pgOffers) return [];
  return flipkartResp.pgOffers.map((o) => ({
    flipkartOfferId: o.id,
    bankName: o.bankName,
    paymentInstruments: o.paymentInstruments ?? [],
    offerTitle: o.offerTitle,
    offerDescription: o.offerDescription,
    tnc: o.tnc,
    offerType: o.offerType,
    discountType: (o.discountType || "").toLowerCase(), // PERCENTAGE → percentage
    discountValue: o.discountValue,
    maxDiscount: o.maxDiscount,
    minAmount: o.minAmount,
    validity: o.validity,
  }));
}

export const getHighestDiscountController = async (req, res) => {
  try {
    const amountToPay = Number(req.query.amountToPay);
    const bankName = req.query.bankName;
    const paymentInstrument = req.query.paymentInstrument; // CREDIT / EMI_OPTIONS …

    if (!amountToPay || !bankName) {
      return res.status(400).json({
        error: "amountToPay (number) and bankName (string) are required",
      });
    }

    /* ---- Build DB filter ---- */
    const filter = { bankName };
    if (paymentInstrument) {
      filter.paymentInstruments = { $in: [paymentInstrument] };
    }

    const offers = await offerModel.find(filter);

    /* ---- Compute highest applicable discount ---- */
    let highest = 0;
    offers.forEach((o) => {
      /* respect min cart amount */
      if (o.minAmount && amountToPay < o.minAmount) return;

      let discount = 0;
      if (o.discountType === "percentage") {
        discount = (amountToPay * o.discountValue) / 100;
      } else if (o.discountType === "fixed") {
        discount = o.discountValue;
      }

      /* enforce cap */
      if (o.maxDiscount && discount > o.maxDiscount) {
        discount = o.maxDiscount;
      }

      highest = Math.max(highest, discount);
    });

    res.status(200).json({
      success: true,
      highestDiscountAmount: highest,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
