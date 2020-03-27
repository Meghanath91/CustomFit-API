SELECT DISTINCT custom_plans.*
      FROM custom_plans
      JOIN students ON students.id = custom_plans.student_id
    WHERE student_id = 1;
