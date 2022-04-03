const express = require("express");
const app = express();
const mongoose = require("mongoose");
const route = require("./routes/route");

app.use(express.json());
app.use("/", route);

try {
  
  mongoose.connect("mongodb+srv://As_357:oJAKh3z4S39UgaUZ@cluster0.k4tlh.mongodb.net/As_357", {
    useNewUrlParser: true,
  });
  console.log(`MongoDB connection successful`);
} catch (error) {
  console.log(error);
}

const port = process.env.PORT || 3000;
app.listen(port, console.log(`Express App running on port ${port} `));
