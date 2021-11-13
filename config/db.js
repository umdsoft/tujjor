const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/tujjor";
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(url, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        mongoose.set('bufferCommands', false);
        mongoose.set('bufferTimeoutMS', 500);
        console.log(`MongoDB connected : ${conn.connection.host}`);
    } catch (err) {
        throw err;
    }
};

module.exports = connectDB;
