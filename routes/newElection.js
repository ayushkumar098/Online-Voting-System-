const newElectionRouter = require("express").Router();

const voterModel = require("../models/voter");
const candidateModel = require("../models/candidate");
const electionModel = require("../models/election");

newElectionRouter.get("/admin/newElection", function (req, res) {
  res.render("newElection");
});

newElectionRouter.post("/admin/newElection", async function (req, res) {
  const { name, party, logo, constituencyId } = req.body;
  console.log(constituencyId);
  const electionId = Math.floor(Math.random() * 1000000);
  const candidateId = Math.floor(Math.random() * 100000);
  const objList = [];
  const x = party.length;
  for (var i = 0; i < x; i++) {
    let obj = {
      electionId: electionId,
      candidateId: candidateId + i,
      name: name[i],
      party: party[i],
      constituencyId: constituencyId,
      logo: logo[i],
      vote: [],
    };
    objList.push(obj);
  }

  await candidateModel.insertMany(objList, function (err) {
    if (err) {
      console.log(err);
    }
  });

  voterModel.find(
    { constituencyId: constituencyId },
    function (err, foundVoters) {
      if (err) {
        console.log(err);
      } else {
        var voterlist = [];
        foundVoters.forEach((v) => {
          voterlist.push(v.voterId);
        });
        const electionObj = {
          electionId: electionId,
          electionName: req.body.electionTitle,
          voters: voterlist,
        };
        electionModel.create(electionObj, function (err, item) {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/dashboard");
          }
        });
      }
    }
  );
});

newElectionRouter.get(
  "/admin/viewResult/:electionId",
  async function (req, res) {
    console.log(req.params.electionId);
    candidateModel.find(
      { electionId: req.params.electionId },
      function (err, candidates) {
        if (err) {
          console.log(err);
        } else {
          res.render("results", { candidates: candidates });
        }
      }
    );
  }
);

newElectionRouter.get(
  "/admin/viewVoters/:electionId",
  async function (req, res) {
    console.log(req.params.electionId);
    electionModel.findOne(
      { electionId: req.params.electionId },
      function (err, foundVoters) {
        if (err) {
          console.log(err);
        } else {
          console.log(foundVoters);
          res.render("voters", {electionId:req.params.electionId ,voters: foundVoters.voters });
        }
      }
    );
  }
);


newElectionRouter.post("/admin/deleteElection", async function (req, res) {
  electionModel.deleteOne({ electionId: req.body.electionId }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Delete Successful.");
    }
  });

  candidateModel.deleteMany(
    { electionId: req.body.electionId },
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Delete Successful.");
        res.redirect("/admin/dashboard");
      }
    }
  );
});

module.exports = newElectionRouter;
