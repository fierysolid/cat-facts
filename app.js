"use strict";

require("dotenv").config({
  silent: true
});

var request = require("request-promise"),
  client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
  TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
  TWILIO_NUMBER = process.env.TWILIO_NUMBER,
  requestUrl,
  init = true,
  count = 0,
  number = "‭+12087616324", //'+1208'
  requestUrl = "https://catfact.ninja/fact";

function sendMessages() {
  /////// Send Single Message ////////
  //   client.messages
  //     .create({
  //       to: number,
  //       from: TWILIO_NUMBER,
  //       body: "ANSWER MY FUCKING QUESTIONS TY"
  //     })
  //     .then(message => console.log("Text: ", message.body))
  //     .catch(err => console.log("Error: ", err.message));

  /////// Send Cat Facts ////////
  if (count === 0) {
    if (init) {
      client.messages
        .create({
          to: number,
          from: TWILIO_NUMBER,
          body:
            "Thanks for signing up for Cat Facts! You now will receive fun daily facts about CATS! >o<, to cancel Daily Cat Facts, reply 'SEXUAL CHOCOLATE'"
        })
        .then(data => console.log("Text: ", data.body))
        .catch(err => console.log("Error: ", err.message));
      init = false;
    } else {
      client.messages
        .create({
          to: number,
          from: TWILIO_NUMBER,
          body: "To cancel Daily Cat Facts, reply 'SEXUAL CHOCOLATE'"
        })
        .then(data => console.log("Text: ", data.body))
        .catch(err => console.log("Error: ", err.message));
    }
    count++;
  } else {
    request({ uri: requestUrl, json: true })
      .then(body => {
        client.messages
          .create({
            to: number,
            from: TWILIO_NUMBER,
            body: body.fact
          })
          .then(data => console.log("Text: ", data.body))
          .catch(err => console.log("Error: ", err.message));
        count++;
        if (count === 10) count = 0;
      })
      .catch(err => console.log("Error: ", err.message));
  }
}

sendMessages();
setInterval(sendMessages, 1000 * 1); // 30 seconds
