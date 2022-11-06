const adminDashboardRouter = require("express").Router();

const electionModel = require("../models/election");

function checkcookie(req, res, next) {
  if (!req.session.voter) {
    req.session.voter = {};
    next();
  } else {
    next();
  }
}

adminDashboardRouter.get("/admin/dashboard", checkcookie, (req, res, next) => {
  electionModel.find({}, function (err, elections) {
    if (err) {
      console.log(err);
    } else {
      res.render("adminDashboard", { elections: elections });
    }
  });
});

module.exports = adminDashboardRouter;
