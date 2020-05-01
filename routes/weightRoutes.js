const express = require("express");
const router = express.Router();
const pool = require("../db/index");

pool.connect();

//***********************************weights*********************************** */
router.post("/weights/create", (req, res) => {
  const { student_id, weight, date } = req.body;
  pool
    .query(
      `
  INSERT INTO weights (student_id, weight,date) VALUES ($1::integer, $2::integer, $3::text) ;

  `,
      [student_id, weight, date]
    )
    .then(() => {
      res.json(`weight updated in db`);
    })
    .catch((error) => console.log(error));
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
    .then((data) => {
      const custom_plan = data.rows;
      res.json(custom_plan);
    })
    .catch((error) => console.log(error));
});

module.exports = router;
