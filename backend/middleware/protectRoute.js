import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
//import { ENV_VARS } from "../config/envVars.js";

export const protectRoute = async (req, res, next) => {
	try {
		const token = req.headers["authorization"];
		
		if (!token) {
			return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
		}

		// Ensure proper format
		const tokenParts = token.split(" ");
		if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    		return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token Format" });
		}

		let decoded;
    try {
        decoded = jwt.verify(tokenParts[1], process.env.ACCESS_TOKEN_SECRET);
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

		req.user = user;

		try {
            next();
        } catch (err) {
            res.status(500).json({ success: false, message: "Middleware Error" });
        }

	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
