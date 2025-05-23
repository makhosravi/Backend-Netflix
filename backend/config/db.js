import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
//import { ENV_VARS } from "./envVars.js";

let retryCount = 0;
const maxRetries = 5;

export const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		console.error("MONGO_URI is not defined in the environment variables.");
		process.exit(1); // Exit the application if MONGO_URI is not defined
	  }
	try {
		//const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
		console.log(process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
		console.log("MongoDB connected: " + conn.connection.host);
	} 
	catch (error) {
		retryCount++;
		console.error("Error connecting to MONGODB: " + error.message);
		if (retryCount < maxRetries) {
      		console.log(`Retrying connection (${retryCount}/${maxRetries}) in 5 seconds...`);
      		setTimeout(connectDB, 5000);
    	} else {
      		console.error("Max retries reached. Exiting...");
      		process.exit(1);
    	}
	}
};
