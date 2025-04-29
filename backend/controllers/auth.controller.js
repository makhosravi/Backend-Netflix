import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokensAndSetCookies } from "../utils/generateTokensAndSetCookies.js";
import jwt from 'jsonwebtoken';

export async function signup(req, res) {
	try {

		const { email, password } = req.body;
	
		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		if (!emailRegex.test(email)) {
			return res.status(400).json({ success: false, message: "Invalid email" });
		}

		if (password.length < 6) {
			return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
		}

		const existingUserByEmail = await User.findOne({ email: email });

		if (existingUserByEmail) {
			return res.status(400).json({ success: false, message: "Email already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const PROFILE_PICS = ["/avatar1.png", "/avatar2.png", "/avatar3.png"];

		const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];

		const newUser = new User({
			email,
			password: hashedPassword,
			image,
		});

		await newUser.save();

		const { accessToken, refreshToken } = await generateTokensAndSetCookies(newUser._id, res);

		res.status(201).json({
			success: true,
			user: {
				...newUser._doc,
				password: undefined,
				access_token:accessToken,
				refresh_token: refreshToken,
			},
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function login(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(404).json({ success: false, message: "Invalid credentials" });
		}

		const isPasswordCorrect = await bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const { accessToken, refreshToken } = generateTokensAndSetCookies(user._id, res);

		res.status(200).json({
			success: true,
			user: {
				...user._doc,
				password: undefined,
				access_token:accessToken,
				refresh_token: refreshToken,
			},
		});
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function logout(req, res) {
	try {
		// Clear both access and refresh token cookies
		res.clearCookie("jwt-netflix", {
			httpOnly: true,
			sameSite: "Strict",
			secure: process.env.NODE_ENV !== "development",
		});

		res.clearCookie("refreshToken", {
			httpOnly: true,
			sameSite: "Strict",
			secure: process.env.NODE_ENV !== "development",
		});
		res.status(200).json({ success: true, message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function authCheck(req, res) {
	try {
		console.log("req.user:", req.user);
		res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in authCheck controller", error.message);
		res.status(500).json({ success: false, message: "Internal server error" });
	}
}

export async function refreshAccessToken (req, res) {
	try {
		const refreshToken = req.body.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ success: false, message: "Refresh token missing" });
		}

		let decoded;
		try {
			decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		} catch (err) {
			return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
		}

		const accessToken = jwt.sign(
			{ userId: decoded.userId },
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "15m" }
		);

		// Optionally set new access token cookie
		res.cookie("jwt-netflix", accessToken, {
			httpOnly: true,
			sameSite: "Strict",
			secure: process.env.NODE_ENV !== "development",
			maxAge: 15 * 60 * 1000, // 15 minutes
		});

		return res.status(200).json({
			success: true,
			accessToken,
		});
	} catch (error) {
		console.error("refreshAccessToken error:", error.message);
		return res.status(500).json({ success: false, message: "Internal Server Error" });
	}
};
