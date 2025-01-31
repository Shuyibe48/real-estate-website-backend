import { Payment } from "./payment.model.js";
import AppError from "../../errors/AppError.js";
import config from "../../config/index.js";
import Stripe from "stripe";
import { Agency } from "../agency/agency.model.js";
import mongoose from "mongoose";
const stripe = Stripe(config.stripe_secret_key);

// const createPayment = async (plan, agency) => {
//   try {
//     const lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: { name: plan.name },
//           unit_amount: parseFloat(plan.price) * 100,
//         },
//         quantity: 1,
//       },
//     ];

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${config.frontend_url}`,
//       cancel_url: `${config.frontend_url}`,
//     });

//     const paymentData = {
//       plan: plan,
//       agency,
//       sessionId: session.id,
//       paymentStatus: "pending",
//     };

//     const newPayment = await Payment.create(paymentData);

//     return { sessionId: session.id, payment: newPayment };
//   } catch (error) {
//     throw new AppError(
//       500,
//       "Failed to create payment intent: " + error.message
//     );
//   }
// };

// main
// const createPayment = async (plan, agency) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const lineItems = [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: { name: plan.name },
//           unit_amount: parseFloat(plan.price) * 100,
//         },
//         quantity: 1,
//       },
//     ];

//     const stripeSession = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: lineItems,
//       mode: "payment",
//       success_url: `${config.frontend_url}`,
//       cancel_url: `${config.frontend_url}`,
//     });

//     const paymentData = {
//       plan: plan,
//       agency: agency,
//       sessionId: stripeSession.id,
//       paymentStatus: "pending",
//     };

//     // Create a new payment within the transaction
//     const newPayment = await Payment.create([paymentData], { session });

//     // Update the agency to push the new payment _id within the transaction
//     await Agency.findByIdAndUpdate(
//       agency?._id,
//       {
//         $push: { payments: newPayment[0]._id },
//       },
//       { new: true, session }
//     );

//     // Commit the transaction
//     await session.commitTransaction();
//     session.endSession();

//     return { sessionId: stripeSession.id, payment: newPayment[0] };
//   } catch (error) {
//     // Abort the transaction on error
//     await session.abortTransaction();
//     session.endSession();
//     throw new AppError(
//       500,
//       "Failed to create payment intent: " + error.message
//     );
//   }
// };

// const processWebhookEvent = async (rawBody, signature) => {
//   try {
//     const event = stripe.webhooks.constructEvent(
//       rawBody,
//       signature,
//       config.stripe_webhook_secret
//     );

//     if (event.type === "checkout.session.completed") {
//       const session = event.data.object;

//       setTimeout(async () => {
//         try {
//           const paymentIntent = await stripe.paymentIntents.retrieve(
//             session.payment_intent
//           );

//           if (paymentIntent.charges.data.length > 0) {
//             const paymentMethod =
//               paymentIntent.charges.data[0].payment_method_details;

//             await Payment.updateOne(
//               { sessionId: session.id },
//               {
//                 $set: {
//                   paymentStatus: "completed",
//                   paymentIntentId: session.payment_intent,
//                   paymentMethod: {
//                     type: paymentMethod.type,
//                     brand: paymentMethod.card?.brand,
//                     last4: paymentMethod.card?.last4,
//                     country: paymentMethod.card?.country,
//                   },
//                 },
//               }
//             );
//           } else {
//             console.error("No charges found for the payment intent.");
//           }
//         } catch (error) {
//           console.error("Error retrieving payment intent:", error);
//         }
//       }, 3000);
//     }
//   } catch (err) {
//     throw new AppError(400, `Webhook Error: ${err.message}`);
//   }
// };

// demo
const createPayment = async (plan, agency) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: { name: plan.name },
          unit_amount: parseFloat(plan.price) * 100,
        },
        quantity: 1,
      },
    ];

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${config.frontend_url}`,
      cancel_url: `${config.frontend_url}`,
    });

    const paymentData = {
      plan: plan,
      agency: agency,
      sessionId: stripeSession.id,
      paymentStatus: "pending",
    };

    console.log(paymentData);

    // Create a new payment within the transaction
    const newPayment = await Payment.create([paymentData], { session });

    // Calculate startDate and endDate
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(plan.duration)); // Add duration days to current date

    // Update the Agency's promotedPlan field
    await Agency.findByIdAndUpdate(
      agency._id,
      {
        $set: {
          promotedPlan: {
            planId: plan._id,
            startDate,
            endDate,
          },
        },
      },
      { new: true, session }
    );

    // Update the agency to push the new payment _id within the transaction
    await Agency.findByIdAndUpdate(
      agency?._id,
      {
        $push: { payments: newPayment[0]._id },
      },
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { sessionId: stripeSession.id, payment: newPayment[0] };
  } catch (error) {
    // Abort the transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      500,
      "Failed to create payment intent: " + error.message
    );
  }
};

// main
const processWebhookEvent = async (rawBody, signature) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe_webhook_secret
    );

    if (event.type === "checkout.session.completed") {
      const sessionData = event.data.object;

      // Delay to ensure payment processing is complete
      setTimeout(async () => {
        try {
          const paymentIntent = await stripe.paymentIntents.retrieve(
            sessionData.payment_intent
          );

          if (paymentIntent.charges.data.length > 0) {
            const paymentMethod =
              paymentIntent.charges.data[0].payment_method_details;

            // Update payment status
            const updatedPayment = await Payment.findOneAndUpdate(
              { sessionId: sessionData.id },
              {
                $set: {
                  paymentStatus: "completed",
                  paymentIntentId: sessionData.payment_intent,
                  paymentMethod: {
                    type: paymentMethod.type,
                    brand: paymentMethod.card?.brand,
                    last4: paymentMethod.card?.last4,
                    country: paymentMethod.card?.country,
                  },
                },
              },
              { new: true, session }
            ).populate("plan agency"); // Populate `plan` and `agency`

            if (updatedPayment) {
              const { plan, agency } = updatedPayment;

              // Calculate startDate and endDate
              const startDate = new Date();
              const endDate = new Date();
              endDate.setDate(endDate.getDate() + parseInt(plan.duration)); // Add duration days to current date

              // Update the Agency's promotedPlan
              await Agency.findByIdAndUpdate(
                agency._id,
                {
                  $set: {
                    promotedPlan: {
                      planId: plan._id,
                      startDate,
                      endDate,
                    },
                  },
                },
                { new: true, session }
              );
            }
          } else {
            console.error("No charges found for the payment intent.");
          }

          // Commit the transaction
          await session.commitTransaction();
        } catch (error) {
          // Abort transaction if any error occurs
          await session.abortTransaction();
          console.error("Error during transaction:", error);
        } finally {
          session.endSession();
        }
      }, 3000);
    }
  } catch (err) {
    // Abort transaction on webhook error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, `Webhook Error: ${err.message}`);
  }
};

// const getPayments = async () => {
//   const result = await Payment.find();
//   return result;
// };
const getPayments = async () => {
  try {
    const result = await Payment.find();

    if (!result || result.length === 0) {
      throw new AppError(httpStatus.NOT_FOUND, "No payments found.");
    }

    return result;
  } catch (error) {
    // ত্রুটি হ্যান্ডলিং
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching payments.");
  }
};


export const PaymentService = {
  createPayment,
  processWebhookEvent,
  getPayments,
};
