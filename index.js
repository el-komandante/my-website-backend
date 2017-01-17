var express = require('express')
var axios = require('axios')
var app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
var Mailgun = require('mailgun-js')
var port = 6060
var API_KEY = process.env.MAILGUN_API_KEY
var DOMAIN_NAME = 'sandbox9fe98e320e20473a93c1b15356c63158.mailgun.org'
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

app.listen(port)
console.log('Listening on port ' + port)
