import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

// export const buyCourse = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     // 1 : take course id out
//     if (!req.query.courseId) {
//       return next(new AppError("Course id not provided", 400));
//     }
//     const { courseId } = req.query;

//     // 2 : take user if out
//     const { userId } = req.query;
//     if (!userId) {
//       return next(new AppError("User id not found in request object", 500));
//     }

//     // 3 : create a session
//     const stripeSession: Stripe.Response<Stripe.Checkout.Session> | void =
//       await createStripeSession(req, String(courseId), String(userId), next);

//     res.status(200).json({
//       stripeSession,
//     });
//   } catch (err: unknown) {
//     globalAsyncCatch(err, next);
//   }
// };

app.patch("/get-stripe-session", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "This is a placeholder for Stripe session generation",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Unable to generate stripe session" });
    }
  }
});

app.get("/test-route", (req: Request, res: Response) => {
  res.status(200).json({ message: "Test route is working!" });
});

export default app;

// export const createStripeSession = async (
//   req: Request,
//   courseId: string,
//   userId: string,
//   next: NextFunction
// ): Promise<Stripe.Response<Stripe.Checkout.Session> | void> => {
//   // 1 : get the course
//   const course = await CourseModel.findById(
//     new mongoose.Types.ObjectId(courseId)
//   );

//   if (!course) {
//     return next(new AppError("No course with provided id", 400));
//   }

//   const user = await UserModel.findById(new mongoose.Types.ObjectId(userId));

//   if (!user) {
//     return next(new AppError("No user for provided id", 400));
//   }

//   // 2 : create a stripe object
//   const stripe = new Stripe(process.env.STRIPE_SEC_KEY as string);

//   if (!stripe) {
//     return next(new AppError("Unable to create a stripe object", 500));
//   }

//   // 3 : create a session with that
//   const stripeSession = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     client_reference_id: course?.id,
//     customer_email: user?.email,
//     success_url: `${req.protocol}://${req.get("host")}/`,
//     line_items: [
//       {
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: course.name,
//           },
//           unit_amount: course.price * 100,
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//   });

//   if (!stripeSession) {
//     return next(new AppError("Unable to create a stripe session", 500));
//   }

//   return stripeSession;
// };
