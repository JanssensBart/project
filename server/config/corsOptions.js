const allowedOrigins = require('./allowedOrigins')

// CORS
const corsOptions = {
    origin: (origin, callback) => {
        // !!!! the !origin is used during development, delete when building
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }else {
            callback(new Error("Server rejected your request defined by CORS"))   
        }
    },
    optionsSuccessStatus: 200,
}

module.exports = corsOptions;