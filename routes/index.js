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
    });
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
    });
});

router.post("/trainers/login", (req, res) => {
  // console.log({body: req.body})
  pool
    .query(`SELECT * FROM trainers WHERE email = $1 `, [req.body.email])
    .then(data => {
      if (data.rows.length === 1) {
        //check password data.rows with bcrypt
        const user = data.rows[0];
        req.session.user_id = user.id;
        res.json(user);
        // console.log(user, "this is user passed to front end");
      } else {
        res.status(401).send('Unauthorized');
      }
    });
});


router.post("/trainers/register", (req, res) => {
  const { name, email, password, about, experience } = req.body;
  pool.query(
      `
  INSERT INTO trainers (name, email, password, about, experience) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text);
  `,
      [name, email, password, about, experience]
    )
    .then(() => {
      res.json("new trainer registered")
      console.log("new trainer register")
    })
    .catch(error => console.log(error));
});

router.put("/trainers", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, password, phone, about, avatar, experience } = req.body;
  pool
    .query(
      `
  UPDATE trainers SET name=$1, email=$2, password=$3, phone=$4, about=$5, avatar=$6, experience=$7 WHERE id =$8
  `,
      [name, email, password, phone, about, avatar, experience, id]
    )
    .then(() => {
      res.json(`trainer ${request.params.id}updated`);
    })
    .catch(error => console.log(error));
});



router.get("/trainer/:id/students", (req, res) => {
  // getting all studentss for a trainer by joining on custom plans
  pool.query(
      `SELECT students.*
    FROM students
    JOIN custom_plans ON custom_plans.student_id = students.id
    JOIN trainers ON trainers.id = custom_plans.trainer_id
  WHERE trainer_id = $1;
   `,
      [req.params.id]
    )
    .then(data => {
      const students = data.rows;
      console.log("studentss passing to the front end ========>>", students);
      res.json(students);
    })
    .catch(error => console.log(error))
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
    });
});

router.post("/students/login", (req, res) => {
  pool.query(`SELECT * FROM students WHERE email =$1 `, [req.body.email])
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
    });
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
    });
});

router.post("/students/register", (req, res) => {
  console.log("this req.body in /register", req)
  const {
    name,
    email,
    password,
    age,
    goal,
    height,
    weight
  } = req.body;
  pool.query(
      `
  INSERT INTO students (name, email, password, age, goal,height,weight) VALUES ($1::text, $2::text, $3::text, $4::integer, $5::text, $6::integer, $7::integer);
  `,
      [name, email, password, age, goal, height, weight]
    )
    .then(() => {
      res.json("new student joined")
      console.log("new student joined to db")
      // res.json(`student ${request.body.id}created`);
    })
    .catch(error => console.log(error));
});

router.put("/students", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    email,
    password,
    phone,
    age,
    avatar,
    goal,
    height,
    weight
  } = req.body;
  pool
    .query(
      `
  UPDATE students SET name=$1, email=$2, password=$3, phone=$4, age=$5, avatar=$6, goal=$7, height=$8, weight=$9 WHERE id =$10
  `,
      [name, email, password, phone, age, avatar, goal, height, weight, id]
    )
    .then(() => {
      res.json(`student ${request.params.id}updated`);
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
    });
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
    type
  } = req.body;
  pool.query(
      `
  INSERT INTO custom_plans (student_id, trainer_id, title, description, difficulty, type) VALUES ($1::integer, $2::integer, $3::text, $4::text, $5::text, $6::text) RETURNING id;

  `,
      [student_id, trainer_id, title, description, difficulty, type]
    )
    .then(data=> {
      console.log("customplan created",data.rows[0].id)
      res.json(data.rows[0].id);
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
    });
});

router.get("/exercises/student", (req, res) => {
  console.log("this is req.body", req.body.params.id);
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
      console.log("exercises passing to the front end ========>>", exercises);
      res.json(exercises);
    });
});


router.get("/student/:id/exercises", (req, res) => {
  // getting all exercises for a student by joining on workout_exercises
  pool.query(
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
    console.log("exercises passing to the front end ========>>", exercises);
    res.json(exercises);
  });
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
      console.log("exercises passing to the front end ========>>", data.rows);
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
  const {
    custom_plan_id,
    exercise_id,
    sets,
    reps,
  } = req.body;
  pool
    .query(
      `
  INSERT INTO workout_exercises (custom_plan_id, exercise_id, sets,reps) VALUES ($1::integer, $2::integer, $3::integer, $4::integer) RETURNING id;

  `,
      [custom_plan_id, exercise_id, sets, reps]
    )
    .then(()=> {
      console.log("exercise created")
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
    });
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
    });
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

// router.get("/", (req, res) => {
//   res.send("Hello world");
// });

module.exports = router;
