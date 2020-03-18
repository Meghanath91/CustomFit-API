SELECT exercise_id as id,custom_plan_id,sets,reps,complete,duration
FROM workout_exercises
JOIN custom_plans ON custom_plans.id = custom_plan_id
WHERE student_id = 1;
