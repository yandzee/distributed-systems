const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')

const app = express()
const servePath = path.join(__dirname, 'dist');
app.use(serveStatic(servePath));

const port = process.env.PORT || 5000
app.listen(port)
console.log('server started ' + port)