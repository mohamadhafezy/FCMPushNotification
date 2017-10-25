/**
 * Created by Sadra Isapanah Amlashi on 6/17/17.
 */
let express = require('express');
let app = express();
let rp = require('request-promise');
let firebase = require('firebase-admin');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

let API_KEY = "key="+"PLEASE_ENTER_YOUR_FCM_API_KEY"; // Your FCM server API key
let TEST_USER_KEY = "PLEASE_ENTER_THE_TEST_USER_FCM_TOKEN_ID"; // User FCM Token ID

let TOPIC_GLOBAL = "/topics/global";
let TOPIC_ONSCREEN = "/topics/onscreen";
let TOPIC_VIP_USER = "/topics/vip_user";

app.get('/', function (req, res) {
    res.send('Hi, This is node.js project')
});


app.post('/send/notification', function (req, res) {

    let body = req.body;

    let payload = {
        notification: {
            "title": body.title,
            "body": body.message
        },
        to : body.target_token ? body.target_token : TEST_USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
        // condition : "'onscreen' in topics && 'vip_user' in topics",
    };

    sendNotification(payload, res)

});

app.post('/send/data-notification', function (req, res) {

    let body = req.body;

    let payload = {
        data: body,
        to : body.target_token ? body.target_token : TEST_USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
        // condition : "'onscreen' in topics && 'vip_user' in topics",
    };

    sendNotification(payload, res)

});

app.post('/send/data-notification/VIP', function (req, res) {

    let body = req.body;

    let payload = {
        data: body,
        condition : "'onscreen' in topics && 'vip_user' in topics",
        // to : req.body.target_token ? req.body.target_token : TEST_USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
    };

    sendNotification(payload, res)

});

app.post('/send/combined-notification/VIP', function (req, res) {

    let body = req.body;

    let payload = {
        notification: {
            "title": body.notify_title,
            "body": body.notify_message
        },
        data: body,
        condition : "'onscreen' in topics && 'vip_user' in topics",
        // to : req.body.target_token ? req.body.target_token : TEST_USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
    };

    sendNotification(payload, res)

});

function sendNotification(payload, res) {

    let options = {
        method: 'POST',
        uri: 'https://fcm.googleapis.com/fcm/send',
        body: payload,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_KEY,
        },
        json: true,
        // collapseKey: "discount",
        // priority: "high",
        // timeToLive: 60 * 60 * 24,
    };

    rp(options)
        .then(function (body) {
            res.send(body);
            console.log("The notification: "+JSON.stringify(payload)+", sent successfully.")
        })
        .catch(function (err) {
            res.send(err);
            console.log("The notification: "+JSON.stringify(payload)+", has problem to be sent. Error is: "+err)
        });

}

app.listen(3000);