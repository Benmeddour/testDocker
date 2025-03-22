const express = require('express')
const app = express()
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = 4000

app.use(express.json())

let refreshTokens = []


const generateAccessToken = (user) => jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });



app.post('/token', function(req, res) {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })
})


app.delete('/logout', function(req, res) {
    refreshTokens = refreshTokens.filter(token => token != req.body.token)
    res.sendStatus(203)
});

app.post('/login', (req, res) => {
    //Authenticate User
    const username = req.body.username
    const user = { name: username }
    const accessToken = generateAccessToken(user)
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
})


app.listen(port, () => console.log(`app listening on port ${port}!`))