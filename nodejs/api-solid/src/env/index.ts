import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
	JWT_SECRET: z.string(),
	PORT: z.coerce.number().default(3333),
	DATABASE_URL: z.string().url(),
});

const envParsed = envSchema.safeParse(process.env);

if (envParsed.success === false) {
	console.error("Invalid environment variables.", envParsed.error.format());

	throw new Error("Invalid environment variables.");
}

export const env = envParsed.data;
