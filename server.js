const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const cookieSession = require("cookie-session");

const route = require("./routes/index");
const twilioRoutes = require("./routes/twilioRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const studentRoutes = require("./routes/studentRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const customPlanRoutes = require("./routes/customPlanRoutes");
const exerciseRoutes = require("./routes/exerciseRoutes");
const historyRoutes = require("./routes/historyRoutes");
const weightRoutes = require("./routes/weightRoutes");

const app = express();
const port = process.env.PORT || 8080;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
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
app.use("/", subscriptionRoutes);
app.use("/", customPlanRoutes);
app.use("/", exerciseRoutes);
app.use("/", historyRoutes);
app.use("/", weightRoutes);
app.use("/twilio", twilioRoutes());

app.listen(port, () => console.log(`Listening on port ${port}`));
