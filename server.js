const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const route = require('./routes/index')

const app = express();
const port = process.env.PORT || 8080;


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route)
app.use('/trainers', route)
app.use('/students',route)
app.use('/exercises',route)
app.use('/custom_plans',route)
app.use('/workout_exercises',route)
app.use('/history',route)


app.listen(port, () => console.log(`Listening on port ${port}`));
