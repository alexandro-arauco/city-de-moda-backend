export default {
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  out: "./src/db/migrations",
  dialect: 'postgresql'
};
