const votingRouter = require("express").Router();

const sgMail = require("@sendgrid/mail");
const crypto = require("crypto");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const candidateModel = require("../models/candidate");
const voterModel = require("../models/voter");

votingRouter.get("/faceRecognition/:electionId", (req, res, next) => {
  voterModel.findOne(
    { email: req.session.voter.email, electionsVoted: req.params.electionId },
    function (err, foundItem) {
      if (err) {
        console.log(err);
      } else {
        console.log(foundItem);
        if (foundItem != null) {
          req.session.voterDetail = { voterId: true };
          res.redirect("/");
        } else {
          req.session.election = { electionId: req.params.electionId };
          console.log(req.session.election.electionId);
          voterModel.findOne(
            { email: req.session.voter.email },
            function (err, foundUser) {
              res.render("loginCheck", { desc: foundUser.imgDesc });
            }
          );
        }
      }
    }
  );
});

votingRouter.get("/generateOTP", (req, res, next) => {
  res.render("generateOTP");
});

votingRouter.post("/generateOTP", (req, res, next) => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  const otp = Math.floor(Math.random() * 100000);
  console.log("OTP: " + otp);

  const infoForMail = {
    date: today,
    otp: otp,
  };

  const msg = {
    to: req.session.voter.email, // Change to your recipient
    from: "onlinevoting20@gmail.com", // Change to your verified sender
    subject: "OTP Verification",
    html: `<h2>Your OTP for voting process verification is: ${otp}</h2>`,
  };

  sgMail.send(msg, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });

  req.session.voterOTP = { otp: otp };
  res.redirect("/verifyOTP");
});

votingRouter.get("/verifyOTP", (req, res, next) => {
  console.log(req.session.voterOTP.otp);
  res.render("verifyOTP");
});

votingRouter.post("/verifyOTP", (req, res, next) => {
  req.session.secret = { secretKey: req.body.secretKey };
  if (req.body.otp == req.session.voterOTP.otp) {
    res.redirect("/casteVote/" + req.session.election.electionId);
  } else {
    res.redirect("/verifyOTP");
  }
});

votingRouter.get("/casteVote/:electionId", (req, res, next) => {
  candidateModel.find(
    { electionId: req.params.electionId },
    function (err, candidates) {
      if (err) {
        console.log(err);
      } else {
        res.render("casteVote", { candidates: candidates });
      }
    }
  );
});

votingRouter.post("/casteVote/:electionId", async function (req, res, next) {
  console.log(req.body.candidateId);

  voterModel.findOne(
    { email: req.session.voter.email },
    function (err, foundVoter) {
      const secret =
        req.session.secret.secretKey +
        foundVoter.voterId +
        req.body.caandidateId;
      var hash = crypto
        .createHash("sha256", secret)
        .update("How are you?")
        .digest("hex");
      console.log(hash);
      candidateModel.findOneAndUpdate(
        { candidateId: req.body.candidateId },
        { $push: { vote: hash } },
        function (err, foundItem) {
          if (err) {
            console.log(err);
          } else {
            console.log("Voted");
          }
        }
      );
    }
  );

  await voterModel.updateOne(
    { email: req.session.voter.email },
    { $push: { electionsVoted: req.params.electionId } }
  );

  req.session.election = null;
  req.session.voterOTP = null;
  req.session.secret = null;

  res.redirect("/");
});

module.exports = votingRouter;
