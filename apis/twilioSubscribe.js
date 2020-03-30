function twilioSubscribe(student) {
  require("dotenv").load();
  const accountSid = process.env.accountSid;
  const authToken = process.env.authToken;
  const trainerNumber = process.env.trainerNumber;
  const twilioNumber = process.env.twilioNumber;

  const client = require("twilio")(accountSid, authToken);

  // Trainer text
  client.messages.create({
    body: `${student} subscribed to your account, Please build the Custom plan`,
    from: twilioNumber,
    to: trainerNumber
  });
}

module.exports = twilioSubscribe;
