import app from "../src/server";

app.use((req, res, next) => {
  req.setTimeout(5 * 60 * 1000); // 5-minute timeout
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

export default app;
