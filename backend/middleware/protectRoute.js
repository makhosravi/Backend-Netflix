import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
//import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.headers["authorization"];
		console.log("authorization in header: ", req.headers["authorization"]);
		
		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

		console.log("protectRoute ==> passed token test!");

		const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
		}

		console.log("protectRoute ==> passed decode test!");

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		console.log("protectRoute ==> passed user test!");

		req.user = user;

		console.log("protectRoute ==> passed assinging user!");

		next();

		console.log("protectRoute ==> passed running next func!");
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
