import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors()); //for frontend backend interaction
app.use(express.json()); //for json format

const start = async () => {
  try {
    const connectDB = await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo is connected");

    app.listen(9090, () => {
      console.log("server is running on 9090");
    });
  } catch (err) {
    console.log(err);
  }
};

start();
