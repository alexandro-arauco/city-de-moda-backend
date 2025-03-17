import app from "../src/server";
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
