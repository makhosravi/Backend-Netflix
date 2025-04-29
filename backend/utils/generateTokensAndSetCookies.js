import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export function generateTokensAndSetCookies(userId, res) {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '15m',
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d',
	});

	// Access Token Cookie (optional — usually sent in header instead)
	res.cookie('jwt-netflix', accessToken, {
		httpOnly: true,
		sameSite: 'Strict',
		secure: process.env.NODE_ENV !== 'development',
		maxAge: 15 * 60 * 1000, // 15 minutes
	});

	// Refresh Token Cookie
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		sameSite: 'Strict',
		secure: process.env.NODE_ENV !== 'development',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	return { accessToken, refreshToken };
}