// JS fallback for Prisma at runtime (useful inside containers without ts processing)
// This mirrors prisma.config.ts but uses CommonJS and process.env directly.
module.exports = {
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations", seed: "tsx prisma/seed.ts" },
  datasource: { url: process.env.DATABASE_URL },
};
