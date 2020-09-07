//importing all middleware requirements
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieSession = require("cookie-session");

//importing all routes
const route = require("./routes/index");
const twilioRoutes = require("./routes/twilioRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const customPlanRoutes = require("./routes/customPlanRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const weightRoutes = require("./routes/weightRoutes");
const workoutExerciseRoutes = require("./routes/workoutExercises");

//initialising objects and port
const app = express();
const port = process.env.PORT || 8080;

//helmet is middleware for Http response headers
app.use(helmet());
//middleware to parse the incoming request bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//Cross-origin-resource-sharing will allow ajax requests to skip the same-origin-policy and access resources from reomte hosts
app.use(cors({ origin: true, credentials: true }));
//middleware to setup cookie session in browser
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// Routes
app.use("/", route);
app.use("/", trainerRoutes);
app.use("/", studentRoutes);
app.use("/", workoutExerciseRoutes);
app.use("/", subscriptionRoutes);
app.use("/", customPlanRoutes);
app.use("/", exerciseRoutes);
app.use("/", feedbackRoutes);
app.use("/", weightRoutes);
app.use("/twilio", twilioRoutes());

app.listen(port, () => console.log(`Listening on port ${port}`));
