let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = '7MS7UyALuaME4lk35bJs0JSIwBsURFGoJnxan83UWJYuuj9M3vN1/suE68rpXCG6cSOk+ytOYHAI85zkHDJ7V6zqtG//5FofP+X3XHShjUf1VkXmspGWDE8JS+hGa4lDm2Th0ZXvSEw1xauEFqCMEQdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {
    let body = req.body
    let message = body.events[0].message.text
    let token = body.events[0].replyToken
    console.log(JSON.stringify(body, null, 2))
    console.log(message)
    sendMessage(token, message)
    res.send('')
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
