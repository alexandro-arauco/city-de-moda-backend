import app from "../src/server";

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

export default app;
