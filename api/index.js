const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
