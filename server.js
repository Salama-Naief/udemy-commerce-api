import { dirname } from "path";
import path from "node:path";
import { fileURLToPath } from "url";

import express from "express";
import { connectDB } from "./db/connect-db.js";
import dotenv from "dotenv";
import expressAsyncErrors from "express-async-errors";

import NotFound from "./middleware/not-found.middleware.js";
import errorHandlerMiddleware from "./middleware/errorHandler.middleware.js";

import MoundedRoute from "./routes/index.js";
import { webhookCheckout } from "./paymentsProdviders/stripe.js";
import { paytabsWebhooks } from "./paymentsProdviders/paytabs.js";

const app = express();

const port = process.env.PORT || 5000;

//@desc contig
dotenv.config();
expressAsyncErrors;

// Checkout webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//@desc middleware
app.use(express.json());
app.post("/paytabs-webhooks", paytabsWebhooks);

//@desc serve static files this work in es6 module
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "uploads")));

//@desc route
MoundedRoute(app);
app.use(NotFound);
//@desc glabal error
app.use(errorHandlerMiddleware);
//@desc connect to data base fris then initail the server
const start = async () => {
  try {
    await connectDB();
    console.log("mongodb id connected");
  } catch (error) {
    console.log(error);
  }
};

const server = app.listen(port, () => {
  console.log(`server listen to port ${port}`);
});
// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});

start();
