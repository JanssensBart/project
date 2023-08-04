const mongoose = require("mongoose")

const connectDB = async ()=> {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        console.log(`MongoDB: connected to ${conn.connection.host}`)
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB;