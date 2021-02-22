import express from "express";

app.get("/", (req, res) => res.send("Hello world"));

app.listen(3000, () => {
  console.log("Server is running at port 3000.\nGo to http://localhost:3000/");
});
