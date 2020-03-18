const express = require("express");
const router = express.Router();
const pool = require("../db/index");
pool.connect();

//**********************************trainer routes************************************//

router.get("/trainers", (req, res) => {
  pool.query(`
    SELECT * FROM trainers;
  `)
    .then(result => {
      res.json(result.rows);
    });
});

router.post("/trainers",(req,res)=>{
  const {name,email,password,phone,about,avatar,experience} =req.body
  pool.query(`
  INSERT INTO trainers (name, email, password, phone, about, avatar, experience) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text);
  `,[name, email, password, phone, about, avatar, experience]
  )
  .then(() => {
    res.json(`database:trainer ${request.params.id}created`);
  })
  .catch(error => console.log(error));

})

//********************************student routes****************************** */

router.get("/students", (req, res) => {
  pool.query(`
  SELECT * FROM students;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

router.get("/students/:id",(req,res)=>{
  const id = parseInt(req.params.id)
  pool.query(`
  SELECT * FROM students WHERE id = $1;
  `,[id])
  .then(result=>{
    res.json(result.rows)
  })
})

router.post("/students",(req,res)=>{
  const {name, email, password, phone, age, avatar, goal, height, weight} =req.body
  pool.query(`
  INSERT INTO students (name, email, password, phone, age, avatar, goal,height,weight) VALUES ($1::text, $2::text, $3::text, $4::text, $5::integer, $6::text, $7::text, $8::integer, $9::integer);
  `,[name, email, password, phone, age, avatar, goal, height, weight]
  )
  .then(() => {
    res.json(`student ${request.params.id}created`);
  })
  .catch(error => console.log(error));

})


//************************************custom_plans***************************** */

router.get("/custom_plans", (req, res) => {
  pool.query(`
  SELECT * FROM custom_plans;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

router.get("/custom_plans/:id",(req,res)=>{
  const id = parseInt(req.params.id)
  pool.query(`
  SELECT * FROM custom_plans WHERE id = $1;
  `,[id])
  .then(result=>{
    res.json(result.rows)
  })
  .catch(error=>console.log(error));
})

router.post("/custom_plans",(req,res)=>{
  const {student_id, trainer_id, title, description, difficulty, type} =req.body
  pool.query(`
  INSERT INTO custom_plans (student_id, trainer_id, title, description, difficulty, type) VALUES ($1::integer, $2::integer, $3::text, $4::text, $5::text, $6::text);

  `,[student_id, trainer_id, title, description, difficulty, type]
  )
  .then(() => {
    res.json(`custom_plan ${req.params.id}created`);
  })
  .catch(error => console.log(error));

})


//***********************************exercises*********************************** */
router.get("/exercises", (req, res) => {
  pool.query(`
  SELECT * FROM exercises;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

router.get("/exercises/:id",(req,res)=>{
  const id = parseInt(req.params.id)
  pool.query(`
  SELECT * FROM exercises WHERE id = $1;
  `,[id])
  .then(result=>{
    res.json(result.rows)
  })
})

router.delete("/exercises/:id",(req,res)=>{
  const id = parseInt(req.params.id)
  pool.query(`
  DELETE FROM exercises WHERE id = $1;
  `,[id])
  .then(() => {
    response.json(`database:exercise ${id}deleted`);
  })
  .catch(error => console.log(error));
}
)


//*****************************workout_exercises***************************** */
router.get("/workout_exercises", (req, res) => {
  pool.query(`
  SELECT * FROM workout_exercises;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});


//****************************history*************************************** */
router.get("/history", (req, res) => {
  pool.query(`
  SELECT * FROM history;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

router.post("/history",(req,res) => {
  const {
    workout_exercise_id,
    feedback_text,
    feedback_video

  } = req.body;
  pool.query(`
  INSERT INTO history (workout_exercise_id, feedback_text, feedback_video) VALUES ($1::integer, $2::text, $3::text);

  `,[workout_exercise_id,feedback_text,feedback_video]
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
