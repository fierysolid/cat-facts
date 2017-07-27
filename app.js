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
    count = 0,
    bodyText;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

setInterval(function() {
    requestUrl = 'http://www.catfact.info/api/v1/facts.json?page=' + getRandomInt(1, 676) + '&per_page=1';
    request({
        url: requestUrl
    }, function(error, response, body) {
        body = JSON.parse(body);
        if (!error) {
            if (count === 1) {
                bodyText = 'Text STOP to end cat facts.'
            } else {
                bodyText = body.facts[0].details
            }
            console.log('Text: ', bodyText);
            client.sendSms({
                to: '', //'+1208',
                from: TWILIO_NUMBER,
                body: bodyText
            }, function(err, data) {
                if (err) console.log('Error: ', err);
            });
            count++;
            if (count === 3) count = 0;
        }
    });
}, 1000 * 60 * 10); // 10 minutes
