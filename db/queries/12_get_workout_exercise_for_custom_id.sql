SELECT exercises.*
      FROM exercises
      JOIN workout_exercises ON workout_exercises.exercise_id = exercises.id
      JOIN custom_plans ON custom_plans.id = workout_exercises.custom_plan_id

    WHERE custom_plan_id = 1;
