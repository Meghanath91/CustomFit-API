const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//to get all trainers

router.get("/trainers", (req, res) => {
  pool
    .query(
      `
    SELECT * FROM trainers;
  `
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});
//to get particular trainer
router.get("/trainers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  pool
    .query(
      `
  SELECT * FROM trainers WHERE id = $1;
  `,
      [id]
    )
    .then((result) => {
      res.json(result.rows);
    })
    .catch((error) => console.log(error));
});

router.post("/trainers/login", (req, res) => {
  pool
    .query(`SELECT * FROM trainers WHERE email = $1 `, [req.body.email])
    .then((data) => {
      if (data.rows.length === 1) {
        //check password data.rows with bcrypt
        const user = data.rows[0];
        req.session.user_id = user.id;
        res.json(user);
        console.log("trainer loggedin");
      } else {
        res.status(401).send("Unauthorized");
      }
    })
    .catch((error) => console.log(error));
});

router.post("/trainers/register", (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    about,
    experience,
    expertise,
  } = req.body;
  pool
    .query(
      `
  INSERT INTO trainers (name, email, password,phone, about, experience, expertise) VALUES ($1::text, $2::text, $3::text,$4::text, $5::text, $6::text, $7::text);
  `,
      [name, email, password, phone, about, experience, expertise]
    )
    .then(() => {
      res.json("new trainer registered");
      console.log("new trainer register");
    })
    .catch((error) => console.log(error));
});

router.put("/trainers", (req, res) => {
  const { name, about, experience, id } = req.body;
  console.log("name is", name, id);
  pool
    .query(
      `
  UPDATE trainers SET name=$1, about=$2, experience=$3 WHERE id=$4;
  `,
      [name, about, experience, id]
    )
    .then((result) => {
      console.log("trainer details updated", result);
      res.json(`trainer details updated`);
    })
    .catch((error) => console.log(error));
});

router.get("/trainer/:id/students", (req, res) => {
  // getting all studentss for a trainer by joining on subscriptions
  pool
    .query(
      `SELECT DISTINCT students.*
          FROM students
          JOIN subscriptions ON subscriptions.student_id = students.id
          JOIN trainers ON trainers.id = subscriptions.trainer_id
        WHERE trainer_id = $1;
   `,
      [req.params.id]
    )
    .then((data) => {
      const students = data.rows;
      console.log("students passing to the front end");
      res.json(students);
    })
    .catch((error) =>
      console.log("failed to fetch all students for a trainer_id", error)
    );
});

module.exports = router;
