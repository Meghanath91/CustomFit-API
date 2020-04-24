const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//**********************************trainer routes************************************//

router.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.send({});
});

module.exports = router;
