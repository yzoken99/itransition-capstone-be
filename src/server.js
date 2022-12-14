import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport";
import listEndpoints from "express-list-endpoints";
import { googleStrategy, facebookStrategy, gitHubStrategy } from "./middleware/oauth.js";

const server = express();
const whiteList = [
  "http://localhost:3000",
  "https://personal-collection.netlify.app/",
];
const corsOptions = {
  origin: function (origin, next) {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Not allowed by CORS"));
    }
  },
};

// *********************** ENV IMPORTS ******************

const { MONGO_URL } = process.env;
const port = process.env.PORT || 3030;

// *********************** IMPORT ROUTES ******************

import userRouter from "./db/users/routes.js";
import itemRouter from "./db/items/routes.js";
import collectionRouter from "./db/collections/routes.js";

// *********************** MIDDLEWARES ******************

passport.use("google", googleStrategy);
passport.use("facebook", facebookStrategy)
passport.use("github", gitHubStrategy)
server.use(cors());
server.use(express.json());
server.use(passport.initialize());

// ************************ ROUTES *********************

server.use("/users", userRouter);
server.use("/items", itemRouter);
server.use("/collections", collectionRouter);

// *********************** DB CONNECTION ****************
mongoose.connect(MONGO_URL);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});
