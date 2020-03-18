const express = require("express");
const router = express.Router();
const pool = require("../db/index");
pool.connect();

router.get("/trainers", (req, res) => {
  pool.query(`
    SELECT * FROM trainers;
  `)
    .then(result => {
      res.json(result.rows);
    });
});

// router.get("/trainers",(req,res)=>{
//   const {name,email,password,phone,about,avatar,experience} =req.body
//   pool.query(`
//   INSERT INTO trainers (name, email, password, phone, about, avatar, experience) VALUES ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text);
//   `,[name, email, password, phone, about, avatar, experience]
//   )
//   .then(() => {
//     response.json(`database:trainer ${request.params.id}created`);
//   })
//   .catch(error => console.log(error));

// })

router.get("/students", (req, res) => {
  pool.query(`
  SELECT * FROM students;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

router.get("/custom_plans", (req, res) => {
  pool.query(`
  SELECT * FROM custom_plans;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

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
// router.delete("/exercises/:id",(req,res)=>{
//   const id = parseInt(req.params.id)
//   pool.query(`
//   DELETE FROM exercises WHERE id = $1
//   `,[id])
//   .then(() => {
//     response.json(`database:exercise ${id}deleted`);
//   })
//   .catch(error => console.log(error));
// }
// )

router.get("/workout_exercises", (req, res) => {
  pool.query(`
  SELECT * FROM workout_exercises;
  `)
  .then(result=>{
    res.json(result.rows);
  })
});

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
