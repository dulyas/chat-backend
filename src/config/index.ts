import dotenv from "dotenv";
dotenv.config();

interface Config {
	PORT: string;
	DB_URL: string;
	JWT_ACCESS_SECRET: string;
	JWT_REFRESH_SECRET: string;
	SMTP_HOST: string;
	SMTP_PORT: string;
	SMTP_USER: string;
	SMTP_PASSWORD: string;
	API_URL: string;
	CLIENT_URL: string;
}

export default {
	PORT: process.env.PORT,
	DB_URL: process.env.DB_URL,
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,
	API_URL: process.env.API_URL,
	CLIENT_URL: process.env.CLIENT_URL,
} as Config;
