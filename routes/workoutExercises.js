const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//*****************************workout_exercises***************************** */


router.post("/workout_exercises/create", (req, res) => {
  const { custom_plan_id, exercise_id } = req.body;
  pool
    .query(
      `
  INSERT INTO workout_exercises (custom_plan_id, exercise_id) VALUES ($1::integer, $2::integer) RETURNING id;

  `,
      [custom_plan_id, exercise_id]
    )
    .then(() => {
      console.log("exercise created");
      res.json(`exercise created`);
    })
    .catch(error => console.log(error));
});

router.get("/workout_exercises", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM workout_exercises;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.get("/workout_exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM workout_exercises WHERE id = $1;
  `,
      [id]
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

//this route is show workout_exercises for a particular student id
router.get("/workout_exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
      SELECT exercise_id as id,custom_plan_id,sets,reps,complete,duration
      FROM workout_exercises
      JOIN custom_plans ON custom_plans.id = custom_plan_id
      WHERE student_id = $1;
  `,
      [id]
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});
module.exports = router;
