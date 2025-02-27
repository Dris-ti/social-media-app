import mongoose from "mongoose";
require("dotenv").config();

type ConnectionObject = {
    isConnected ?: number
}

const connection: ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected)
    {
        console.log("Database already connected.");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully.");

    }
    catch(error)
    {
        console.log("Failed to connect Database.", error)
        process.exit(1);
    }
}

export default dbConnect;