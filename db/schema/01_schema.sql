DROP TABLE IF EXISTS trainers
CASCADE;
DROP TABLE IF EXISTS students
CASCADE;
DROP TABLE IF EXISTS subscriptions
CASCADE;
DROP TABLE IF EXISTS custom_plans
CASCADE;
DROP TABLE IF EXISTS workout_exercises
CASCADE;
DROP TABLE IF EXISTS history
CASCADE;
DROP TABLE IF EXISTS exercises
CASCADE;


CREATE TABLE trainers
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(10),
  about VARCHAR(255),
  avatar VARCHAR(255) DEFAULT '/pictures/trainer1.png',
  image VARCHAR[][][],
  experience VARCHAR(255),
  created_at TIMESTAMPTZ
);

CREATE TABLE students
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(10),
  age INTEGER DEFAULT 0,
  avatar VARCHAR(255),
  goal VARCHAR(255),
  height INTEGER DEFAULT 0,
  weight INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ
);

CREATE TABLE subscriptions
(
  id SERIAL PRIMARY KEY NOT NULL,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,

  content VARCHAR(255) DEFAULT 'New Student Subscribed',
  seen BOOLEAN DEFAULT FALSE

);

CREATE TABLE custom_plans
(
  id SERIAL PRIMARY KEY NOT NULL,
  student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
  trainer_id INTEGER REFERENCES trainers(id) ON DELETE CASCADE,

  title VARCHAR(255) ,
  description VARCHAR(255),
  difficulty VARCHAR(255),
  type VARCHAR(255),
  created_at TIMESTAMPTZ

);

CREATE TABLE exercises
(
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  explanation VARCHAR(255),
  body_part VARCHAR(255),
  type VARCHAR(255) NOT NULL,
  thumbnail_photo_url VARCHAR(255) NOT NULL,
  content_video VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ

);



CREATE TABLE workout_exercises
(
  id SERIAL PRIMARY KEY NOT NULL,
  custom_plan_id INTEGER REFERENCES custom_plans(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,

  sets INTEGER,
  reps INTEGER,
  complete BOOLEAN,
  duration DECIMAL(4,2) DEFAULT 0,
  created_at TIMESTAMPTZ

);




CREATE TABLE history
(
  id SERIAL PRIMARY KEY NOT NULL,
  workout_exercise_id INTEGER REFERENCES workout_exercises(id) ON DELETE CASCADE,

  feedback_text VARCHAR(255),
  feedback_video VARCHAR(255),
  created_at TIMESTAMPTZ
);
