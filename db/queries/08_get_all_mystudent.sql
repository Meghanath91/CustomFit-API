SELECT students.*
      FROM students
      JOIN custom_plans ON custom_plans.student_id = students.id
      JOIN trainers ON trainers.id = custom_plans.trainer_id
    WHERE trainer_id = 1;
