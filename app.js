/* eslint-disable indent */
const express = require('express')
const movies = require('./movies.json')

const app = express()

app.disable('x-powered-by')

// app.use(express.json())

app.get('/', (req, res) => {
    res.json({ message: 'hola primo!' })
    // res.end('Hola world!')
})

app.get('/movies', (req, res) => {
    res.json(movies)
})

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
