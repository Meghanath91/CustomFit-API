const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//********************************student routes****************************** */

router.get("/students", (req, res) => {
  pool
    .query(
      `
  SELECT * FROM students;
  `
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.post("/students/login", (req, res) => {
  pool
    .query(`SELECT * FROM students WHERE email =$1 `, [req.body.email])
    .then((data) => {
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
    .catch((error) => console.log(error));
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
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.post("/students/register", (req, res) => {
  console.log("this req.body in /register", req);
  const {
    name,
    email,
    password,
    phone,
    age,
    goal,
    height,
    weight,
    focus,
  } = req.body;
  pool
    .query(
      `
  INSERT INTO students (name, email, password,phone, age, goal,height,weight,focus) VALUES ($1::text, $2::text, $3::text, $4::text, $5::integer, $6::text, $7::integer, $8::integer,$9::text);
  `,
      [name, email, password, phone, age, goal, height, weight, focus]
    )
    .then(() => {
      res.json("new student joined");
    })
    .catch((error) => console.log(error));
});

router.put("/students", (req, res) => {
  const { name, goal, height, weight, id } = req.body;
  pool
    .query(
      `
  UPDATE students SET name=$1, goal=$2, height=$3, weight=$4 WHERE id=$5;
  `,
      [name, goal, height, weight, id]
    )
    .then((result) => {
      res.json(`student details updated`);
    })
    .catch((error) => console.log(error));
});

router.get("/student/:id/trainers", (req, res) => {
  // getting all trainers for a student by joining on subscriptions
  pool
    .query(
      `SELECT DISTINCT trainers.*
          FROM trainers
          JOIN subscriptions ON subscriptions.trainer_id = trainers.id
          JOIN students ON students.id = subscriptions.student_id
        WHERE student_id = $1;
   `,
      [req.params.id]
    )
    .then((data) => {
      const trainers = data.rows;
      res.json(trainers);
    })
    .catch((error) =>
      console.log("failed to fetch all students for a trainer_id", error)
    );
});

module.exports = router;
