import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import Stripe from "stripe";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// project complete
export const createStripeSession = async (
  req: Request,
  next: NextFunction
): Promise<Stripe.Response<Stripe.Checkout.Session> | void | null> => {
  // console.log("request body");
  // console.log(req.body);

  console.log("stripe secret key");
  console.log(process.env.STRIPE_SEC_KEY);

  if (
    process.env.STRIPE_SEC_KEY === undefined ||
    process.env.STRIPE_SEC_KEY.length <= 0
  ) {
    throw new Error("Stripe secret key is not set in environment variables");
  }
  // 2 : create a stripe object
  const stripe = new Stripe(process.env.STRIPE_SEC_KEY as string);

  if (!stripe) {
    return null;
  }

  // 3 : create a session with that
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: req.body?.propertyId,
    success_url: req.body?.successUrl,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Rent: ${req.body?.propertyType.slice(0, 4)}${
              req.body?.propertyNumber
            }`,
          },
          unit_amount: Number(req.body?.propertyRent) * 100, // Replace with actual price in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });

  if (!stripeSession) {
    return null;
  }

  return stripeSession;
};

app.patch(
  "/stripe-session",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // 3 : create a session
      const stripeSession: Stripe.Response<Stripe.Checkout.Session> | void | null =
        await createStripeSession(req, next);

      if (!stripeSession) {
        throw new Error("Unable to create a stripe session");
      }

      res.status(200).json({
        stripeSession,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unable to generate stripe session" });
      }
    }
  }
);

app.get("/test-route", (req: Request, res: Response) => {
  res.status(200).json({ message: "Test route is working!" });
});

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to stripe-payment-prople" });
});

export default app;
