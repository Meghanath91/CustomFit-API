const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const route = require('./routes/index')
const cors = require('cors');
const cookieSession = require('cookie-session')

const app = express();
const port = process.env.PORT || 8080;


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))


app.use('/', route)


app.listen(port, () => console.log(`Listening on port ${port}`));
