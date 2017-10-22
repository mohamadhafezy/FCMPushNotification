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

let API_KEY = "key=AAAAr_E2NCM:APA91bEgmznGj0R5PpRg1ek7GKeMmpADJ5BjFdqK81sU8-DpZZ6lwwd9H9PAugMkM-Q4KKXil3Dt961MgDQubbSBRyx0xEvvamJ4PljIGf5mx-SDtHIB3KbIvGWJq5-AUH36fLC-82CL"; // Your FCM server API key
// let API_KEY = "PLEASE_ENTER_YOUR_FCM_API_KEY"; // Your FCM server API key
// let USER_KEY = "PLEASE_ENTER_THE_TEST_USER_FCM_TOKEN_ID"; // User FCM Token ID
let USER_KEY = "eWRAtJC2zTs:APA91bEZ_zgxYiEWFaxpHI_wMDO5IApmEtIpYvBZ_D1pkjP8ekQ9M33oceEqDtZ0Z7hyrWHGS4TzIg0Ql6BkW48smrpnZSAMVHk4znpDU-89hDGMOpxO6vFyth642ZU6N64W7ZYIRLDe"; // User client ID

let TOPIC_GLOBAL = "/topics/global";
let TOPIC_ONSCREEN = "/topics/onscreen";
let TOPIC_VIP_USER = "/topics/vip_user";

app.get('/', function (req, res) {
    res.send('Hi, This is node.js project')
});

app.post('/send/notification', function (req, res) {

    let data = {
        notification: {
            "title": req.body.title,
            "body": req.body.message
        },
        to : req.body.target_token ? req.body.target_token : USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
        // condition : "'onscreen' in topics && 'special-user' in topics",
    };

    sendNotification(data, res)

});

app.post('/send/data-notification', function (req, res) {

    let body = req.body;

    let data = {
        data: {
            title: req.body.title,
            body: body
        },
        to : req.body.target_token ? req.body.target_token : USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
    };

    sendNotification(data, res)

});

app.post('/send/data-notification/VIP', function (req, res) {

    let body = req.body;

    let data = {
        data: {
            title: req.body.title,
            body: body
        },
        condition : "'onscreen' in topics && 'vip_user' in topics",
        // to : req.body.target_token ? req.body.target_token : USER_KEY,
        // to : TOPIC_GLOBAL,
        // to : TOPIC_VIP_USER,
    };

    sendNotification(data, res)

});

function sendNotification(data, res) {

    let options = {
        method: 'POST',
        uri: 'https://fcm.googleapis.com/fcm/send',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': API_KEY,
        },
        json: true
    };

    rp(options)
        .then(function (body) {
            res.send(body);
            console.log("The notification: "+JSON.stringify(data)+", sent successfully.")
        })
        .catch(function (err) {
            res.send(err);
            console.log("The notification: "+JSON.stringify(data)+", has problem to be sent. Error is: "+err)
        });

}

app.listen(3000);