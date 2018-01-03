var express = require('express')
var axios = require('axios')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Mailgun = require('mailgun-js')
var port = 6060
var API_KEY = process.env.MAILGUN_API_KEY
var DOMAIN_NAME = 'sandbox9fe98e320e20473a93c1b15356c63158.mailgun.org'
var UI_PATH = process.env.UI_PATH
app.use(cors())
app.use(bodyParser.json())
app.post('/messages', function(req, res) {
  var data = {
    from: 'rudydeberry@sandbox9fe98e320e20473a93c1b15356c63158.mailgun.org',
    to: ['rudydeberry@hotmail.com'],
    subject: 'Message from ' + req.body.name + '<' + req.body.email + '>',
    text: req.body.message
  }
  var mailgun = new Mailgun({apiKey: API_KEY, domain: DOMAIN_NAME})
  mailgun.messages().send(data, function(err, body) {
    if (err) {
            console.log("got an error: ", err)
    }
    else {
        console.log(body)
    }
  })
  console.log('Message sent from ' + req.body.email)
  res.status(200).send({
    message: req.body.message
  })
})

app.get('/ui', function(req, res) {
  var auth = {login: process.env.TWILIO_LOGIN, password: process.env.TWILIO_PW }
  var b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  var lp = new Buffer(b64auth, 'base64').toString().split(':')
  var login = lp[0]
  var password = lp[1]
  if (!login || !password || login !== auth.login || password !== auth.password) {
    res.set('WWW-Authenticate', 'Basic realm="This is a realm"')
    res.status(401).send()
    return
  }
  res.sendFile(UI_PATH)
})

app.listen(port)
console.log('Listening on port ' + port)
