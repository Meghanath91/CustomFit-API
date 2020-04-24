const express = require("express");
const router = express.Router();
const pool = require("../db/index");

const twilioCreate = require("../apis/twilioCreate");

pool.connect();

//************************************custom_plans***************************** */

router.get("/custom_plans", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM custom_plans;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.get("/custom_plans/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM custom_plans WHERE id = $1;
  `,
      [id]
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.post("/custom_plans/create", (req, res) => {
  const {
    student_id,
    trainer_id,
    title,
    description,
    difficulty,
    type,
    sets,
    reps,
    trainer_name
  } = req.body;
  pool
    .query(
      `
  INSERT INTO custom_plans (student_id, trainer_id, title, description, difficulty, type, sets, reps, trainer_name) VALUES ($1::integer, $2::integer, $3::text, $4::text, $5::text, $6::text, $7::integer, $8::integer, $9::text) RETURNING *;

  `,
      [student_id, trainer_id, title, description, difficulty, type, sets, reps, trainer_name]
    )
    .then(data => {
      console.log("customplan created", data.rows[0].trainer_name);
      res.json(data.rows[0].id);
      twilioCreate(data.rows[0].trainer_name)
    })
    .catch(error => console.log(error));
});

router.get("/student/:id/custom_plans", (req, res) => {
  // getting all custom_plans for a student by joining on custom_plans
  pool
    .query(
      `SELECT DISTINCT custom_plans.*
        FROM custom_plans
        JOIN students ON students.id = custom_plans.student_id
        WHERE student_id = $1;
   `,
    [req.params.id]
  )
  .then(data => {
    const custom_plan = data.rows;
    console.log("custom Plan passing to the front end ========>>");
    res.json(custom_plan);
  })
  .catch(error => console.log(error));
});
router.get("/custom_plan/:id/exercises", (req, res) => {
  // getting all exercises for a custom_plan by joining on custom_plans
  pool
    .query(
      `SELECT exercises.*
      FROM exercises
      JOIN workout_exercises ON workout_exercises.exercise_id = exercises.id
      JOIN custom_plans ON custom_plans.id = workout_exercises.custom_plan_id

    WHERE custom_plan_id = $1;
   `,
    [req.params.id]
  )
  .then(data => {
    const exercises = data.rows;
    console.log("custom Plan exercises passing to the frontend ========>>");
    res.json(exercises);
  })
  .catch(error => console.log(error));
});


router.put("/custom_plans", (req, res) => {
  // const id = parseInt(req.params.id);
  console.log(req.body)
  const {
    complete,
    id

  } = req.body;
  pool.query(
      `
  UPDATE custom_plans SET complete=$1 WHERE id=$2
  `,[complete,id]
    )
    .then(result => {
      console.log("custom plan completed",result);
      res.json(`customplan completed`);
    })
    .catch(error => console.log(error));
});
module.exports = router;
