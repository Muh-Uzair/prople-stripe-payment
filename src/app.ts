import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import Stripe from "stripe";

const app = express();
app.use(morgan("dev"));

export const createStripeSession = async (
  req: Request,
  next: NextFunction
): Promise<Stripe.Response<Stripe.Checkout.Session> | void | null> => {
  // 2 : create a stripe object
  const stripe = new Stripe(process.env.STRIPE_SEC_KEY as string);

  if (!stripe) {
    return null;
  }

  // 3 : create a session with that
  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    client_reference_id: "123",
    customer_email: "muhammaduzair1062001@gmail.com", // Replace with actual user email if available
    success_url: `${req.protocol}://${req.get("host")}/`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "rent",
          },
          unit_amount: 1000, // Replace with actual price in cents
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
  "/get-stripe-session",
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
