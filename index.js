require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(cors({
  origin: ["https://appointment-module-client.vercel.app"],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true,
  allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"));

const person = require("./Routes/personRoutes");
const booked = require("./Routes/bookedAppointments");

app.get("/", (req, res) => {
  res.send("Welcome to the Webhook Servers!");
});
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Connect to MongoDB
connectToMongoDB();
const PORT = process.env.PORT || 3000;
app.use('/person', person)
app.use('/booked', booked)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

