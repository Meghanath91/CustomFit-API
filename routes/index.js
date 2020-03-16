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


router.get("")

router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = router;
