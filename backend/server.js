import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import postRoutes from "./routes/post.route.js"
import userRoutes from "./routes/user.route.js"

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true,
})); //for frontend backend interaction
app.use(express.json()); //for json format - keep always above the routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Connexa API is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ message: "ok" });
});

//Use Routes
app.use(postRoutes)
app.use(userRoutes)

const start = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo is connected");

    const port = process.env.PORT || 9090;

    app.listen(port, () => {
      console.log(`server is running on ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
