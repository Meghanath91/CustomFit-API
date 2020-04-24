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
  const { name, email, password,phone, age, goal, height, weight,focus } = req.body;
  pool
    .query(
      `
  INSERT INTO students (name, email, password,phone, age, goal,height,weight,focus) VALUES ($1::text, $2::text, $3::text, $4::text, $5::integer, $6::text, $7::integer, $8::integer,$9::text);
  `,
      [name, email, password,phone, age, goal, height, weight,focus]
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

module.exports = router;
