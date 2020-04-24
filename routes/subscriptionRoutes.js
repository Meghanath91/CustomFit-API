const express = require("express");
const router = express.Router();
const pool = require("../db/index");
const twilioSubscribe = require("../apis/twilioSubscribe");
pool.connect();

//************************************Subscriptions***************************** *//

router.put("/subscriptions/:id", (req, res) => {
  // update the susbscriptions
  const { seen } = req.body;
  pool
    .query(
      `
      UPDATE subscriptions SET seen=$1  WHERE id =$2

   `,
      [seen, req.params.id]
    )
    .then((data) => {
      // const exercises = data.rows;
      console.log("notifications  seen ========>>");
      res.json("seen updated");
    })
    .catch((error) => console.log(error));
});

router.get("/trainer/:id/subscriptions", (req, res) => {
  // getting all subscriptions for a student by joining on workout_exercises
  pool
    .query(
      `SELECT subscriptions.*
        FROM subscriptions
        JOIN trainers ON trainers.id = subscriptions.trainer_id
      WHERE trainer_id = $1;
   `,
      [req.params.id]
    )
    .then((data) => {
      const exercises = data.rows;
      console.log("subscriptions passing to the front end ========>>");
      res.json(exercises);
    })
    .catch((error) => console.log(error));
});

//post req
router.post("/subscriptions/subscribe", (req, res) => {
  const { student_id, trainer_id, student_name } = req.body;
  pool
    .query(
      `
  INSERT INTO subscriptions (student_id, trainer_id,student_name) VALUES ($1::integer, $2::integer, $3::TEXT) RETURNING *;

  `,
      [student_id, trainer_id, student_name]
    )
    .then((data) => {
      console.log("new subscription created", data.rows[0].student_name);
      res.json(data.rows[0].id);
      twilioSubscribe(data.rows[0].student_name);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
