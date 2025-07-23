import "dotenv/config";
import express from "express";
import cors from "cors";
import offerRoutes from "./routes/offerRoute.js";
import { connectDB } from "./config/db.js";

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// database config
connectDB();

// routes
app.use("/api/v1/payment-offers", offerRoutes);

// PORT
const PORT = process.env.PORT || 5000;

// listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello from the server");
});
