SELECT DISTINCT subscriptions.*
    FROM subscriptions
    JOIN trainers ON trainers.id = subscriptions.trainer_id
  WHERE trainer_id = 1
