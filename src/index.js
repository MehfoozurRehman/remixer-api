const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const auth = require("./middleware/auth");
const user = require("./routes/user");

dotenv.config();
const app = express();
const port = process.env.PORT || 9000;

app.enable("trust proxy");
app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((error) => {
    console.log("Database connection failed. Exiting now...");
    console.error(error);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

app.use("/", user);

app.post("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌");
});

app.get("*", auth, (req, res) =>
  res.status(404).json({ message: "404 page not found" })
);

app.listen(port, () => console.log(`Server is running on port ${port}`));
