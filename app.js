let jsSHA = require('jssha');
let btoa = require('btoa');

const express = require('express')
const app = express()
const port = 3001
require('dotenv').config()

let applicationId = process.env.APPLICATIONID;
let developerKey = process.env.DEVELOPERKEY;

function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(9999));
}

function generateToken(expiresInSeconds) {
    var EPOCH_SECONDS = 62167219200;
    var expires = Math.floor(Date.now() / 1000) + expiresInSeconds + EPOCH_SECONDS;
    var shaObj = new jsSHA("SHA-384", "TEXT");
    shaObj.setHMACKey(developerKey, "TEXT");
    jid = "demoUser" + getRandomInt() + '@' + applicationId;
    var body = 'provision' + '\x00' + jid + '\x00' + expires + '\x00';
    shaObj.update(body);
    var mac = shaObj.getHMAC("HEX");
    var serialized = body + '\0' + mac;
    return btoa(serialized);
}

app.use(express.static('public'))

app.get('/token', (req, res) => {
    let thirtyMinutes = 30 * 60;
    let response = JSON.stringify({
        token: generateToken(thirtyMinutes)
    });
    res.send(response);
})

app.listen(port, () => console.log(`Listening on port ${port}!`))