const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/fetchUrl', (req, res) => {
    const requestedUrl = req.query.requestedUrl;

    console.log("Requested URL of front-end proxy is: " + requestedUrl);

    const options = {
        url: requestedUrl, 
        headers: {
            "User-Agent": "request",
            "Content-Type": "application/json"
        }
    }

    request(options, (error, response, body) => {
        if (error || response.statusCode !== 200) {
            return res.status(500).json({ type: 'error', message: error.message });
        }

        if (isJsonResponse(response)) {
            console.log("Received body " + body + " on requested url " + requestedUrl);
            res.json(JSON.parse(body));
        } else {
            res.status(400).send("Invalid request. Must be JSON link.");
        }
    })
});

function isJsonResponse(response) {
    const contentTypeHeaderValue = response.headers["content-type"];
    return contentTypeHeaderValue != null && contentTypeHeaderValue.startsWith("application/json");
}

const PORT = process.env.PORT || 3100;
app.listen(PORT, () => console.log(`listening on ${PORT}`));
