const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.json({
        message: 'Welcome to Online Academy server!'
    })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Online Academy server is running at http://localhost:${PORT}`);
})