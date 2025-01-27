//import mongoose from "mongoose";
//import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
	if (!process.env.MONGO_URI) {
		console.error("MONGO_URI is not defined in the environment variables.");
		process.exit(1); // Exit the application if MONGO_URI is not defined
	  }
	try {
		//const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
		console.log(process.env.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		console.log("MongoDB connected: " + conn.connection.host);
	} catch (error) {
		console.error("Error connecting to MONGODB: " + error.message);
		process.exit(1);
	}
};
