const mongoose = require('mongoose');

module.exports = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to mongo successfully');
    } catch (error) {
        console.log("connection failed to mongodb",error);
    }
}