// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2023-10-16",
// });

// interface InitializeBody {
//   email: string;
//   amount: number; // in smallest currency unit (e.g. kobo, cents)
// }

// export default defineEventHandler(async (event) => {
//   const body = await readBody<InitializeBody>(event);

//   if (!body?.email || !body?.amount) {
//     return {
//       success: false,
//       error: "Missing parameters",
//     };
//   }

//   try {
//     const session = await stripe.checkout.sessions.create({
//       mode: "payment",
//       customer_email: body.email,
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: "Payment",
//             },
//             unit_amount: body.amount,
//           },
//           quantity: 1,
//         },
//       ],
//       success_url: `${process.env.APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.APP_URL}/cancel`,
//     });

//     return {
//       success: true,
//       reference: session.id,
//       url: session.url,
//     };
//   } catch (error: any) {
//     return {
//       success: false,
//       error: error?.message ?? "Stripe initialization failed",
//     };
//   }
// });
