SELECT DISTINCT students.*
      FROM students
      JOIN subscriptions ON subscriptions.student_id = students.id
      JOIN trainers ON trainers.id = subscriptions.trainer_id
    WHERE trainer_id = 1
