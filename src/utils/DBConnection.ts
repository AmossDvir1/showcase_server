const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
    try{
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log("Connected to DB!")
    }
    catch(err){
        console.log(err)
    }
};
export {connectToDB};
