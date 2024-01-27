const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const AppError = require('./utils/appError')
const cors = require('cors')

const userRoutes = require('./routes/userRoutes')
const reportRoutes = require('./routes/reportRoutes')
const globalErrorHandler = require('./controllers/errorControlller')

// Start express app
const app = express()

// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// enables trust proxy
if (process.env.NODE_ENV === 'production') {
  app.enable('trust proxy')
}

// Set security http headers
app.use(helmet())

// Implement CORS
app.use(cors())
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      scriptSrc: [
        "'self'",
        'https://unpkg *',
        '*',
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
        'https://js.stripe.com*',
      ],
      imgSrc: ["'self'", 'https://unpkg *', '*', 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'],
      objectSrc: ["'none'"],
      frameSrc: ["'self'", 'https:', 'data:'],
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
      upgradeInsecureRequests: [],
    },
  }),
)
app.options('*', cors())

// limit requests from same IP ( 100 request per IP )
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

app.use(compression())

// Mounting Routers
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/reports', reportRoutes)

app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404))
})

app.use(globalErrorHandler)

module.exports = app
