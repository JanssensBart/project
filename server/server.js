require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");

const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const {notFound,errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require("./config/dbConn");
const GameLogic = require("./game/gameLogic")
const userRoutes  = require('./routes/userRoutes')

//connect to MongoDB
connectDB();
// Run base gamelogic

//Middleware
app.use(cookieParser())
// cross origin resource sharing
const allowedOrigins = [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
];


app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}))

GameLogic(app);


// MIDDLEWARE (fires between req and res)
//used for form data
app.use(express.urlencoded({ extended: true })); // extended : true allows form-data
app.use(express.json());

//Routes
app.use("/api/users" , userRoutes)

// Protected routes
app.use(notFound)
app.use(errorHandler)

mongoose.connection.once("open", () => {
    app.listen(PORT, ()=> console.log(`Server running on port: ${PORT}`));
});
