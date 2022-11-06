// Importing required Libraries
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();

const loginRouter = require("./routes/login");
const adminDashboardRoute = require("./routes/adminDashboard");
const newElectionRouter = require("./routes/newElection");
const votingRouter = require("./routes/voting");

mongoose.connect("mongodb://localhost:27017/onlineVotingDB", {
  useNewUrlParser: true,
});

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));
app.use("/admin", express.static("public"));
// app.use("/faceRecognition/webcam", express.static("public"));
app.use("/faceRecognition", express.static("public"));
app.use("/faceRecognition", express.static("routes"));
app.use("/register", express.static("public"));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");

app.use(
  session({
    name: "voter",
    secret: process.env.cookie || "Sectre-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 630000,
      sameSite: "lax",
    },
  })
);

function checkcookie(req, res, next) {
  if (!req.session.voter) {
    req.session.voter = {};
    next();
  } else {
    next();
  }
}



app.use(loginRouter);
app.use(votingRouter);
app.use(adminDashboardRoute);
app.use(newElectionRouter);


app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
