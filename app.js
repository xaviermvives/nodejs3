/* eslint-disable indent */
const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')

const app = express()

app.disable('x-powered-by')

app.use(express.json())

app.get('/movies', (req, res) => {
    const { genre } = req.query
    console.log(genre)
    if (genre) {
        const filteredMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
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

app.post('/movies', (req, res) => {
    const {
        title,
        genre,
        director, year,
        duration, poster,
        rate
    } = req.body

    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        title,
        genre,
        director,
        year,
        duration,
        poster,
        rate: rate ?? 0
    }

    // Esto no seria REST pq estaríamos guardando el estado de la aplicación en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie) // reenviamos para actualizar la caché del cliente
})

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
