const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//****************************history*************************************** */


router.get("/trainer/:id/feedbacks", (req, res) => {
  console.log("====================>")

  pool
    .query(
      `
      SELECT feedbacks.*
        FROM feedbacks
        JOIN trainers ON trainers.id = feedbacks.trainer_id
        WHERE trainer_id = $1;
  `,
      [req.params.id]
    )
    .then((data) => {

      res.json(data.rows);
    })
    .catch((error) => console.log(error));
});




router.post("/feedback", (req, res) => {
  const { student_id, trainer_id, feedback_text, feedback_video } = req.body;
  pool
    .query(
      `
  INSERT INTO feedbacks (student_id,trainer_id, feedback_text, feedback_video) VALUES ($1::integer,$2::integer, $3::text, $4::text);

  `,
      [student_id, trainer_id, feedback_text, feedback_video]
    )
    .then(() => {
      res.json(`feedback updated in db`);
    })
    .catch((error) => console.log(error));
});
module.exports = router;
