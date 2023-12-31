/* eslint-disable indent */
const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()

app.disable('x-powered-by')

// métodos normales: GET, HEAD, POST
// métodos complejos: PUT, PATCH, DELETE
// en los complejos existe el CORS PRE-FLIGHT

app.use(express.json())

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3005',
    'https://movies.com',
    'http://midu.dev'

]

app.get('/movies', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*')
    const origin = req.header('origin')
    // cuando la petición es del mismo ORIGIN
    // http://localhost:1234 --> http://localhost:1234
    // entonces no envia el header 'origin'
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }
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
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const newMovie = {
        id: crypto.randomUUID(), // uuid v4
        ...result.data
    }

    // Esto no seria REST pq estaríamos guardando el estado de la aplicación en memoria
    movies.push(newMovie)

    res.status(201).json(newMovie) // reenviamos para actualizar la caché del cliente
})

app.patch('/movies/:id', (req, res) => {
    const result = validatePartialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updatedMovie

    return res.json(updatedMovie)
})

app.delete('/movies/:id', (req, res) => {
    // solving CORS Error
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
    }

    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)

    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }

    movies.splice(movieIndex, 1)

    return res.json({ message: 'Movie deleted' })
})

app.options('/movies/:id', (req, res) => {
    const origin = req.header('origin')
    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin)
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    }
    res.sendStatus(200)
})

const PORT = process.env.PORT ?? 3005

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})
