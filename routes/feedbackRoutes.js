const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//****************************history*************************************** */
router.get("/history", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM history;
  `
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.get("/history/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM history WHERE id = $1;
  `,
      [id]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.post("/feedback", (req, res) => {
  const { student_id, trainer_id, feedback_text, feedback_video } = req.body;
  pool
    .query(
      `
  INSERT INTO history (student_id,trainer_id, feedback_text, feedback_video) VALUES ($1::integer, $2::text, $3::text);

  `,
      [student_id,trainer_id, feedback_text, feedback_video]
    )
    .then(() => {
      response.json(`database:feedback ${request.params.id}created`);
    })
    .catch((error) => console.log(error));
});
module.exports = router;
