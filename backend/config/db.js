import mongoose from "mongoose";
//import { ENV_VARS } from "./envVars.js";

export const connectDB = async () => {
	try {
		//const conn = await mongoose.connect(ENV_VARS.MONGO_URI);
		const conn = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
		  console.log('MongoDB connected successfully');
		})
		.catch((error) => {
		  console.error('Error connecting to MongoDB:', error);
		});
		console.log("MongoDB connected: " + conn.connection.host);
	} catch (error) {
		console.error("Error connecting to MONGODB: " + error.message);
		process.exit(1);
	}
};
