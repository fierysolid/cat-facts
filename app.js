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
    number = '+15035025329'; //'+1208'

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function sendMessages() {
    if (count === 0) {
        if (init) {
            client.sendSms({
                to: number,
                from: TWILIO_NUMBER,
                body: 'Thanks for signing up for Cat Facts! You now will receive fun daily facts about CATS! >o<, to cancel Daily Cat Facts, reply \'SEXUAL CHOCOLATE\''
            }, function(err, data) {
                if (err) console.log('Error: ', err.message);
                console.log('Text: ', data.body);
            });
            init = false;
        } else {
            client.sendSms({
                to: number,
                from: TWILIO_NUMBER,
                body: 'To cancel Daily Cat Facts, reply \'SEXUAL CHOCOLATE\''
            }, function(err, data) {
                if (err) console.log('Error: ', err.message);
                console.log('Text: ', data.body);
            });
        }
        count++;
    } else {
        requestUrl = 'https://catfact.ninja/fact';
        request({
            url: requestUrl
        }, function(error, response, body) {
            body = JSON.parse(body);
            if (!error) {
                client.sendSms({
                    to: number,
                    from: TWILIO_NUMBER,
                    body: body.fact
                }, function(err, data) {
                    if (err) console.log('Error: ', err.message);
                    console.log('Text: ', data.body);
                });
                count++;
                if (count === 10) count = 0;
            }
        });
    }
}

sendMessages();
setInterval(sendMessages, 1000 * 30); // 30 seconds
