const express = require('express')
const app = express()
require('dotenv').config();
const jwt = require('jsonwebtoken');
const port = 5000

app.use(express.json())

const posts = [{
        username: 'Nafae',
        title: 'Post 1'
    },
    {
        username: 'Mohamed',
        title: 'Post 2'
    }
]
const AuthenticateToken = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })

}


app.get('/posts', AuthenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
})

app.listen(port, () => console.log(`app listening on port ${port}!`))