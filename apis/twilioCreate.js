function twilioCreate(trainer) {
  require("dotenv").load();
  const accountSid = process.env.accountSid;
  const authToken = process.env.authToken;
  const twilioNumber = process.env.twilioNumber;
  const studentNumber = process.env.studentNumber;

  const client = require("twilio")(accountSid, authToken);

  // student text
  client.messages.create({
    body: `${trainer} created a custom workout plan for you, Please check out`,
    from: twilioNumber,
    to: studentNumber
  });
}

// module.exports = twilioCreate;
