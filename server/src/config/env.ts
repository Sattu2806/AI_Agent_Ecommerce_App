import "dotenv/config"

function getEnv(key:string): string {
    const value = process.env[key];
    if (value == null || value === "") {
        throw new Error(`Missing required env: ${key}`);
    }
    return value;
}

function getEnvOptional(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  nodeEnv: getEnvOptional("NODE_ENV") ?? "development",
  port: Number(getEnvOptional("PORT")) || 3001,
  databaseUrl: getEnv("DATABASE_URL"),
  jwtSecret:
    getEnvOptional("JWT_SECRET") ?? "dev-secret-change-in-production",
  clientUrl: getEnvOptional("CLIENT_URL") ?? "http://localhost:3000",
  serverUrl: getEnvOptional("SERVER_URL") ?? "http://localhost:3001",
  googleClientId: getEnvOptional("GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvOptional("GOOGLE_CLIENT_SECRET"),
  cloudinaryCloudName: getEnvOptional("CLOUDINARY_CLOUD_NAME"),
  cloudinaryApiKey: getEnvOptional("CLOUDINARY_API_KEY"),
  cloudinaryApiSecret: getEnvOptional("CLOUDINARY_API_SECRET"),
  cloudinaryUploadPreset: getEnvOptional("CLOUDINARY_UPLOAD_PRESET"),
} as const;
