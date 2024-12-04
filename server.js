if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const cors = require('cors');

app.use(cors());

const indexRouter = require('./routes/index')
const booksRouter = require('./routes/books')
const genresRouter = require('./routes/genres')
const path = require('path')

app.set('view engine', 'ejs')
app.set('vies', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/books', booksRouter)
app.use('/genres', genresRouter)

app.listen(process.env.PORT || 3000)