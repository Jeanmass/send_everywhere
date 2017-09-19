/*
For this app to work, you have to paste all necessary informations like email adress, user names, tokens for every social network account your want your message to be sent to.
There is a comment "// FILL IN" after every line you need to edit.
*/


// init Express
var express = require('express');
var app = express();
var server = require('http').createServer(app);

// init fs
var fs = require('fs');

// init nodemailer
const nodemailer = require('nodemailer');
var mail = "youremail@yourprovider.com"; // FILL IN

// init Facebook
var FB = require('fb');
FB.setAccessToken('paste_access_token'); // FILL IN

// init Slack
var Slack = require('slack-node');
slack = new Slack();
slack.setWebhook("paste_web_hook");  // FILL IN

// init body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// init twitter
var Twitter = require('twitter');
var client = new Twitter({
  consumer_key: 'paste_consumer_key', // FILL IN
  consumer_secret: 'paste_consumer_secret', // FILL IN
  access_token_key: 'paste_access_token_key', // FILL IN
  access_token_secret: 'paste_access_token_secret' // FILL IN
});

// Create global variables for the message
var title = "";
var body = "";
var message = "";

// Web server
app.use(express.static('client'));

// Main function
app.post('/send', function(req, res) {
  var title = req.body.title;
  var body = req.body.message;
  var twitteralert = req.body.twitteralert;
  var message = title +" "+ body;
  sendMail(title,body);
  sendFacebook(message);
  if (twitteralert==0) {
    sendTwitter(message);
  }
  sendSlack(message);
  storeMessage(title,message);
  confirmation = true;
  res.send(confirmation);
});


// Slack
function sendSlack(message) {
  slack.webhook({
    channel: "#chosenchannel",  // FILL IN
    username: "john_doe",  // FILL IN
    text: message
  }, function(err, response) {
    console.log("Slack Response :\n")
    console.log(response);
    if (err){
    }
  });
};

// Twitter
function sendTwitter(message){
  client.post('statuses/update', {status: message}, function(error, tweet, response) {
    if (!error) {
      console.log("Twitter Response :\n")
      console.log(tweet);
    } else {
    }
  });
};

// Facebook
function sendFacebook(message) {
  FB.api('me/feed', 'post', { message: message}, function (res) {
    if(!res || res.error) {
      console.log("Facebook Response :\n")
      console.log(!res ? 'error occurred' : res.error);
      return;
    }
    console.log("Facebook Response :\n")
    console.log('Post Id: ' + res.id);
  });
};


// Mail
function sendMail(title,body) {
  let mailer = nodemailer.createTransport({
    service: 'provider',  // FILL IN
    auth: {
      user: 'youremail@yourprovider.com',  // FILL IN
      pass: 'your_passphrase'  // FILL IN
    }
  });
  let mailOptions = {
    from: '"Your name" <youremail@yourprovider.com>',  // FILL IN
    to: mail,
    subject: title,
    text: body,
  };
  mailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Mail Response :\n")
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

// Give me the time
function getDateTime() {
  var date = new Date();
  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  var day  = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return day +"-"+ month+"-" + year + "_" + hour + ":" + min;
}

// Write new message in a file
function storeMessage(title,message) {
  var date = getDateTime();
  var cleantitle = title.replace(/[^\w\s]/g,"");
  var filename = "sent_messages/" + cleantitle + "_" + date + ".txt";
  fs.writeFile(filename, message, (err) => {
    if (err) throw err;
    console.log('Message saved under ' + filename);
  });
}

// Opens port
server.listen(8080);
