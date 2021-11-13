const mongoose = require("mongoose");

const url = "mongodb://localhost:27017/tujjor";
const connectDB = async () => {
    try {
        setTimeout(function() {
            const conn = await mongoose.connect(url, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            });
            console.log(`MongoDB connected : ${conn.connection.host}`);
        }, 6000);
        mongoose.set('bufferCommands', false);
        mongoose.set('bufferTimeoutMS', 500);
    } catch (err) {
        throw err;
    }
};

module.exports = connectDB;
