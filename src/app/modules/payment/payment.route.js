import express from "express";
import { PaymentController } from "./payment.controller.js";

const paymentRouter = express.Router();

// Existing route for creating payment
paymentRouter.post("/create-payment-intent", PaymentController.createPayment);
// New route for webhook
paymentRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleWebhook
);
paymentRouter.get("/get-payments", PaymentController.getPayments);

export const PaymentRoutes = paymentRouter;
