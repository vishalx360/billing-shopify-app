import dotenv from "dotenv";
dotenv.config();
// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import CreditsRouter from "./routers/creditsRouter.js";
import shopifyRouter from "./routers/shopifyRouter.js"
import shopify from "./config/shopify.js";

import { connectDb } from "./config/db.js";
import { userCreator } from "./middlewares/userCreator.js";
const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

await connectDb();

const app = express();

// Set up Shopify Routers
app.use(shopifyRouter);

// MIDDLEWARES -----
app.use(express.json());
// Require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());
app.use("/api/*", userCreator);
app.use("/api/credits", CreditsRouter);

app.use(serveStatic(STATIC_PATH, { index: false }));
app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});


app.listen(PORT);
