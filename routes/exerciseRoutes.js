const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();
//***********************************exercises*********************************** */
router.get("/exercises", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM exercises;
  `
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.get("/exercises/student", (req, res) => {
  // console.log("this is req.body", req.body.params.id);
  pool
    .query(
      `SELECT exercise_id as id,custom_plan_id,sets,reps,complete,duration
      FROM workout_exercises
      JOIN custom_plans ON custom_plans.id = custom_plan_id
      WHERE student_id = $1;
     `,
      [req.body.params.id]
    )
    .then((data) => {
      const exercises = data.rows;
      console.log("exercises passing to the front end ========>>");
      res.json(exercises);
    })
    .catch((error) => console.log(error));
});

router.get("/student/:id/exercises", (req, res) => {
  // getting all exercises for a student by joining on workout_exercises
  pool
    .query(
      `SELECT exercises.*
        FROM exercises
        JOIN workout_exercises ON workout_exercises.exercise_id = exercises.id
        JOIN custom_plans ON custom_plans.id = workout_exercises.custom_plan_id
        JOIN students ON students.id = custom_plans.student_id
      WHERE student_id = $1;
   `,
      [req.params.id]
    )
    .then((data) => {
      const exercises = data.rows;
      console.log("exercises passing to the front end ========>>");
      res.json(exercises);
    })
    .catch((error) => console.log(error));
});

router.post("/exercises/exercise", (req, res) => {
  // const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM exercises WHERE id = $1;
  `,
      [req.body.params.id]
    )
    .then((data) => {
      console.log("exercises passing to the front end ========>>");
      res.json(data.rows);
    })
    .catch((error) => console.log(error));
});

router.delete("/exercises/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  DELETE FROM exercises WHERE id = $1;
  `,
      [id]
    )
    .then(() => {
      response.json(`database:exercise ${id}deleted`);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
