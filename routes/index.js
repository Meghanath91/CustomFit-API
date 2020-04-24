const express = require("express");
const router = express.Router();
const pool = require("../db/index");

const twilioCreate = require("../apis/twilioCreate");

pool.connect();

//**********************************trainer routes************************************//

router.post('/logout',(req,res)=>{
  req.session.user_id=null;
  res.send({});
})










//***********************************exercises*********************************** */
router.get("/exercises", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM exercises;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
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
    .then(data => {
      const exercises = data.rows;
      console.log("exercises passing to the front end ========>>");
      res.json(exercises);
    })
    .catch(error => console.log(error));
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
  .then(data => {
    const exercises = data.rows;
    console.log("exercises passing to the front end ========>>");
    res.json(exercises);
  })
  .catch(error => console.log(error));
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
    .then(data => {
      console.log("exercises passing to the front end ========>>");
      res.json(data.rows);
    })
    .catch(error => console.log(error));
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
    .catch(error => console.log(error));
});

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

//****************************history*************************************** */
router.get("/history", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM history;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
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
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.post("/history", (req, res) => {
  const { workout_exercise_id, feedback_text, feedback_video } = req.body;
  pool
    .query(
      `
  INSERT INTO history (workout_exercise_id, feedback_text, feedback_video) VALUES ($1::integer, $2::text, $3::text);

  `,
      [workout_exercise_id, feedback_text, feedback_video]
    )
    .then(() => {
      response.json(`database:history ${request.params.id}created`);
    })
    .catch(error => console.log(error));
});


//***********************************weights*********************************** */
router.post("/weights/create", (req, res) => {
  const { student_id, weight,date } = req.body;
  pool
    .query(
      `
  INSERT INTO weights (student_id, weight,date) VALUES ($1::integer, $2::integer, $3::text) ;

  `,
      [student_id, weight,date]
    )
    .then(() => {
      console.log("new weight updated");
      res.json(`weight updated in db`);
    })
    .catch(error => console.log(error));
});

router.get("/student/:id/weights", (req, res) => {
  // getting all weight inputs for a student by joining on weights
  pool
    .query(
      `SELECT weights.*
        FROM weights
        JOIN students ON students.id = weights.student_id
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


module.exports = router;
