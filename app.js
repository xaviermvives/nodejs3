/* eslint-disable indent */
const express = require('express')
const movies = require('./movies.json')

const app = express()

app.disable('x-powered-by')

// app.use(express.json())

app.get('/movies', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.includes(genre))
        return res.json(filteredMovies)
    }
    res.json(movies)
})

app.get('/movies/:id', (req, res) => { // path-to-regexp
    const { id } = req.params
    const movie = movies.find(movie => movie.id === id)
    if (movie) return res.json(movie)

    res.status(404).json({ message: 'Movie not found' })
})

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
