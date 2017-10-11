'use strict';

require('dotenv').config({
    silent: true
});

var request = require('request'),
    twilio = require('twilio'),
    TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN,
    TWILIO_NUMBER = process.env.TWILIO_NUMBER,
    client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
    requestUrl,
    init = true,
    count = 0,
    bodyText,
    number = '+16318489328'; //'+1208'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function sendMessages() {
    if (count === 0) {
        if (init) {
            console.log('Text: Thanks for signing up for Cat Facts! You now will receive fun daily facts about CATS! >o<, to cancel Daily Cat Facts, reply \'poopy diaper\'');
            client.sendSms({
                to: number,
                from: TWILIO_NUMBER,
                body: 'Thanks for signing up for Cat Facts! You now will receive fun daily facts about CATS! >o<, to cancel Daily Cat Facts, reply \'poopy diaper\''
            }, function(err, data) {
                if (err) console.log('Error: ', err.message);
            });
            init = false;
        } else {
            console.log('Text: To cancel Daily Cat Facts, reply \'poopy diaper\'');
            client.sendSms({
                to: number,
                from: TWILIO_NUMBER,
                body: 'To cancel Daily Cat Facts, reply \'poopy diaper\''
            }, function(err, data) {
                if (err) console.log('Error: ', err.message);
            });
        }
        count++;
        if (count === 3) count = 0;
    } else {
        requestUrl = 'https://catfact.ninja/fact';
        request({
            url: requestUrl
        }, function(error, response, body) {
            body = JSON.parse(body);
            if (!error) {
                bodyText = body.fact
                console.log('Text: ', bodyText);
                client.sendSms({
                    to: number,
                    from: TWILIO_NUMBER,
                    body: bodyText
                }, function(err, data) {
                    if (err) console.log('Error: ', err.message);
                });
                count++;
                if (count === 3) count = 0;
            }
        });
    }
}

sendMessages();
setInterval(sendMessages, 1000 * 30); // 30 seconds
