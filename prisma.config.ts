import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    url: process.env.DATABASE_URL,
  },

  migrations: {
    seed: "node prisma/seed.js", // or .ts if you're using ts-node
  },
});
