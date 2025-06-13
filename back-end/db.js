import mongoose from "mongoose";
const connectionToDB = async (databaseURL) => {
    try {
        await mongoose.connect(process.env.DB_URL || databaseURL );
    } catch (error) {
        console.log("Failed to connect to DB");
    }
}
export {
    connectionToDB
}