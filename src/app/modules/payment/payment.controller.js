import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import { PaymentService } from "./payment.service.js";

const createPayment = catchAsync(async (req, res) => {
  const { plan, agency } = req.body;

  const result = await PaymentService.createPayment(plan, agency);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment intent created successfully",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  // Call service to handle webhook event
  await PaymentService.processWebhookEvent(req.rawBody, sig);

  res.status(httpStatus.OK).json({ received: true });
});

const getPayments = catchAsync(async (req, res) => {
  const result = await PaymentService.getPayments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payments are retrieve successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  handleWebhook,
  getPayments,
};
