import "dotenv/config";
function getEnv(key) {
    const value = process.env[key];
    if (value == null || value === "") {
        throw new Error(`Missing required env: ${key}`);
    }
    return value;
}
function getEnvOptional(key) {
    return process.env[key];
}
export const env = {
    nodeEnv: getEnvOptional("NODE_ENV") ?? "development",
    port: Number(getEnvOptional("PORT")) || 3001,
    databaseUrl: getEnv("DATABASE_URL"),
    jwtSecret: getEnvOptional("JWT_SECRET") ?? "dev-secret-change-in-production",
    clientUrl: getEnvOptional("CLIENT_URL") ?? "http://localhost:3000",
    serverUrl: getEnvOptional("SERVER_URL") ?? "http://localhost:3001",
    googleClientId: getEnvOptional("GOOGLE_CLIENT_ID"),
    googleClientSecret: getEnvOptional("GOOGLE_CLIENT_SECRET"),
};
//# sourceMappingURL=env.js.map