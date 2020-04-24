const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const route = require('./routes/index')
const cors = require('cors');
const cookieSession = require('cookie-session')

const twilioRoutes = require("./routes/twilioRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");


const app = express();
const port = process.env.PORT || 8080;


app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true}));
// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', "*");
//   res.header('Access-Control-Allow-Credentials', true);
//   res.header('Access-Control-Allow-Headers', 'Set-Cookie, Origin, X-Requested-With, Content-Type, Accept');
//   next();
// });

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

// Routes
app.use('/', route)
app.use('/',trainerRoutes)
app.use('/',studentRoutes)
app.use('/',subscriptionRoutes)
app.use('/twilio',twilioRoutes())


app.listen(port, () => console.log(`Listening on port ${port}`));
