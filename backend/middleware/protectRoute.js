import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
//import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.headers["authorization"];
		console.log("authorization in header: ", token);
		
		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

		console.log("protectRoute ==> passed token test!");

		// Ensure proper format
		const tokenParts = token.split(" ");
		if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    		return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token Format" });
		}

		let decoded;
    try {
        decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: "Token expired" });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }


		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
		}

		console.log("protectRoute ==> passed decode test!");

		let user;
        try {
            user = await User.findById(decoded.userId).select("-password");
        } catch (err) {
            console.log("protectRoute -> Database error:", err);
            return res.status(500).json({ success: false, message: "Database Error" });
        }

		if (!user) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		console.log("protectRoute ==> passed user test!");

		req.user = user;

		console.log("protectRoute ==> passed assinging user!");

		try {
            next();
        } catch (err) {
            console.log("Error after calling next():", err);
            res.status(500).json({ success: false, message: "Middleware Error" });
        }

		console.log("protectRoute ==> passed running next func!");
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
