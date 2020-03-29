const express = require("express");
const router = express.Router();
const pool = require("../db/index");
pool.connect();

//**********************************trainer routes************************************//

router.post('/logout',(req,res)=>{
  req.session.user_id=null;
  res.send({});
})



router.get("/trainers", (req, res) => {
  pool
    .query(
      `
    SELECT * FROM trainers;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.get("/trainers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM trainers WHERE id = $1;
  `,
      [id]
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.post("/trainers/login", (req, res) => {

  pool
    .query(`SELECT * FROM trainers WHERE email = $1 `, [req.body.email])
    .then(data => {
      if (data.rows.length === 1) {
        //check password data.rows with bcrypt
        const user = data.rows[0];
        req.session.user_id = user.id;
        res.json(user);
        console.log("trainer loggedin")
      } else {
        res.status(401).send("Unauthorized");
      }
    })
    .catch(error => console.log(error));
});

router.post("/trainers/register", (req, res) => {
  const { name, email, password, about, experience } = req.body;
  pool
    .query(
      `
  INSERT INTO trainers (name, email, password, about, experience) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text);
  `,
      [name, email, password, about, experience]
    )
    .then(() => {
      res.json("new trainer registered");
      console.log("new trainer register");
    })
    .catch(error => console.log(error));
});



router.put("/trainers", (req, res) => {

  const { name, about, experience, id } = req.body;
  console.log("name is",name,id);
  pool
    .query(
      `
  UPDATE trainers SET name=$1, about=$2, experience=$3 WHERE id=$4;
  `,[name, about, experience, id]
    )
    .then(result => {
      console.log("trainer details updated",result)
      res.json(`trainer details updated`);
    })
    .catch(error => console.log(error));
});



router.get("/trainer/:id/students", (req, res) => {
  // getting all studentss for a trainer by joining on custom plans
  pool.query(
      `SELECT DISTINCT students.*
        FROM students
        JOIN custom_plans ON custom_plans.student_id = students.id
        JOIN trainers ON trainers.id = custom_plans.trainer_id
      WHERE trainer_id = $1;
   `,
      [req.params.id]
    )
    .then(data => {
      const students = data.rows;
      console.log("students passing to the front end");
      res.json(students);
    })
    .catch(error => console.log("failed to fetch all students for a trainer_id",error))
});



//********************************student routes****************************** */

router.get("/students", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM students;
  `
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.post("/students/login", (req, res) => {
  pool
    .query(`SELECT * FROM students WHERE email =$1 `, [req.body.email])
    .then(data => {
      if (data.rows.length === 1) {
        //check password data.rows with bcrypt
        const user = data.rows[0];

        req.session.user_id = user.id;

        res.json(user);
      } else {
        res.status(401);
        res.end();
      }
    })
    .catch(error => console.log(error));
});

router.get("/students/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM students WHERE id = $1;
  `,
      [id]
    )
    .then(result => {
      res.json(result.rows);
    })
    .catch(error => console.log(error));
});

router.post("/students/register", (req, res) => {
  console.log("this req.body in /register", req);
  const { name, email, password, age, goal, height, weight } = req.body;
  pool
    .query(
      `
  INSERT INTO students (name, email, password, age, goal,height,weight) VALUES ($1::text, $2::text, $3::text, $4::integer, $5::text, $6::integer, $7::integer);
  `,
      [name, email, password, age, goal, height, weight]
    )
    .then(() => {
      res.json("new student joined");
      console.log("new student joined to db");
      // res.json(`student ${request.body.id}created`);
    })
    .catch(error => console.log(error));
});



router.put("/students", (req, res) => {
  // const id = parseInt(req.params.id);

  console.log("this is req.body",req.body)
  const {
    name,
    goal,
    height,
    weight,
    id

  } = req.body;
  pool.query(
      `
  UPDATE students SET name=$1, goal=$2, height=$3, weight=$4 WHERE id=$5;
  `,[name,goal,height,weight,id]
    )
    .then(result => {
      console.log("student details updated",result);
      res.json(`student details updated`);
    })
    .catch(error => console.log(error));
});

//************************************Subscriptions***************************** *//


router.put("/subscriptions/:id", (req, res) => {
  // update the susbscriptions
  const {
    seen
  }= req.body
  pool
    .query(
      `
      UPDATE subscriptions SET seen=$1  WHERE id =$2

   `,
    [seen,req.params.id]
  )
  .then(data => {
    // const exercises = data.rows;
    console.log("notifications  seen ========>>");
    res.json("seen updated");
  })
  .catch(error => console.log(error));
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
  .then(data => {
    const exercises = data.rows;
    console.log("subscriptions passing to the front end ========>>");
    res.json(exercises);
  })
  .catch(error => console.log(error));
});




router.post("/subscriptions/subscribe", (req, res) => {
  const {
    student_id,
    trainer_id,
  } = req.body;
  pool
    .query(
      `
  INSERT INTO subscriptions (student_id, trainer_id) VALUES ($1::integer, $2::integer) RETURNING id;

  `,
      [student_id, trainer_id]
    )
    .then(data => {
      console.log("new subscription created", data.rows[0].id);
      res.json(data.rows[0].id);
    })
    .catch(error => console.log(error));
});



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
    reps
  } = req.body;
  pool
    .query(
      `
  INSERT INTO custom_plans (student_id, trainer_id, title, description, difficulty, type, sets, reps) VALUES ($1::integer, $2::integer, $3::text, $4::text, $5::text, $6::text, $7::integer, $8::integer) RETURNING id;

  `,
      [student_id, trainer_id, title, description, difficulty, type, sets, reps]
    )
    .then(data => {
      console.log("customplan created", data.rows[0].id);
      res.json(data.rows[0].id);
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
    console.log("custom Plan exercises passing to the front end ========>>");
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
  INSERT INTO workout_exercises (student_id, weight,date) VALUES ($1::integer, $2::integer, $3::date) ;

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
