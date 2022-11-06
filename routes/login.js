const loginRouter = require("express").Router();
const bcrypt = require("bcryptjs");

const saltRounds = 10;
const voterModel = require("../models/voter");
const electionModel = require("../models/election");

function checkcookie(req, res, next) {
  if (!req.session.voter) {
    res.redirect("/login");
  } else {
    next();
  }
}

loginRouter.get("/login", (req, res, next) => {
  res.render("login");
});

loginRouter.get("/register", (req, res, next) => {
  res.render("register");
});

loginRouter.get("/register/form", checkcookie, (req, res, next) => {
  res.render("infoForm");
});

loginRouter.get("/", checkcookie, function (req, res) {
  
  voterModel.findOne({ email: req.session.voter.email }, function (err, voter) {
    if (err) {
      console.log(err);
    } else {
      req.session.voterDetail = { voterId: voter.voterId };
      electionModel.find(
        { voters: voter.voterId },
        function (e, foundElections) {
          if (e) {
            console.log(e);
          } else {
            const elections = new Map();
            foundElections.forEach(election => {
              if (voter.electionsVoted.includes(election.electionId)) {
                elections.set(election,false);
              }else{
                elections.set(election, true);
              }
            });
            //console.log(elections);
            res.render("home", {
              voter: voter,
              elections: elections,
            });
          }
        }
      );
    }
  });
});

loginRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await voterModel.findOne({ email });

  if (!user) {
    return res.redirect("/login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.redirect("/login");
  }
  req.session.voter = { email: email };
  res.redirect("/");
});

loginRouter.post("/register", async (req, res, next) => {
  const { email, password } = req.body;

  let user = await voterModel.findOne({ email });
  if (user) {
    return res.redirect("/register");
  }

  const hashedPsw = await bcrypt.hash(password, saltRounds);
  user = new voterModel({
    email: email,
    password: hashedPsw,
  });
  console.log(user);
  await user.save();
  req.session.voter = { email: email };
  res.redirect("/register/form");
});

loginRouter.post("/register/form", checkcookie, async (req, res, next) => {
  console.log(req.session.voter);

  const {
    name,
    voterId,
    constituencyId,
    passportNo,
    country,
    mobileNo,
    imgURL,
    imgDesc,
  } = req.body;

  query = {
    name: name,
    voterId: voterId,
    constituencyId: constituencyId,
    passportNo: passportNo,
    country: country,
    mobileNo: mobileNo,
    imgUrl: imgURL,
    imgDesc: imgDesc,
  };

  voterModel.findOneAndUpdate(
    { email: req.session.voter.email },
    query,
    function (err, foundItem) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/login");
      }
    }
  );
});

loginRouter.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

module.exports = loginRouter;
