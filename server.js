const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// load env
dotenv.config({ path: "./config.env" });

const app = express();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Dev logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("short", { stream: accessLogStream }));
}

// profile routes
app.use("/api/v1/profile", require("./routes/profile"));
const port = process.env.PORT || 8000;

// Handle production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${port}!`
  );
});
