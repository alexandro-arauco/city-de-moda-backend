import app from "../src/server";
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

export default app;
