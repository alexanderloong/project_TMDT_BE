// dotenv
require("dotenv").config();

// Import module
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const auth = require("./routes/auth");
const booking = require("./routes/booking");
const mng = require("./routes/mng");

// Main func
const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@clusteralexanderloong1.jmes0.mongodb.net/Nailservice?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
    );

    console.log("MongoDB connected!");
  } catch (error) {
    console.log(error.message);
    process.exit(-1);
  }
};

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", auth);
app.use("/api/booking", booking);
app.use("/api/manage", mng);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
