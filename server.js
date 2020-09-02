require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const movies = require('./movie-data.json');
const app = express();
console.log(process.env.API_TOKEN);
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(function validateToken(req, res, next) {
    const token = req.get('Authorization').split(' ')[1];
    const apiTOKEN = process.env.API_TOKEN;

    if (token !== apiTOKEN) {
        res.status(401).json({
            error: 'Unauthorized request'
        });
    }
    next();
});

app.get('/movie', (req, res) => {
    let response = movies;

    if (req.query.genre) {
        response = response.filter(movie => movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()));
    }
    if (req.query.country) {
        response = response.filter(movie => movie.country.toLowerCase().includes(req.query.country.toLowerCase()));
    }
    if (req.query.avg_vote) {
        response = response.filter(movie => movie.avg_vote >= Number(req.query.avg_vote));
    }

    res.json(response);
})

const PORT = 8000;
app.listen(PORT, () => {
    console.log("You are now listening to PORT 8000");
})