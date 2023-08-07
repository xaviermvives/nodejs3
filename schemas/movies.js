/* eslint-disable indent */
const z = require('zod')

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string',
        required_error: 'Movie title is required'
    }),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(0),
    poster: z.string().url({
        message: 'Poster must be a valid URL'
    }),
    genre: z.array(
        z.enum(['Action', 'Drama', 'Adventure', 'Comedy', 'Fantasy', 'Horror', 'Sci-Fi', 'Thriller', 'Crime']),
        {
            required_error: 'Movie genre is required',
            invalid_type_error: 'Movie genre must be an array of enum Genre'
        }
    )
})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

module.exports = {
    validateMovie
}
