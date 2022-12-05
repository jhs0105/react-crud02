const express = require("express");
const app = express();
const path = require("path");
const db = require("./db/db");

app.set("port", process.env.PORT || 8081);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//app.set("views", path.join(__dirname, "ejs"));

const PORT = app.get("port");
//ejs, pug(jade)
app.set("view engine", "ejs"); //ejs는 html에 data를 쉽게 쓰기 위해 사용.

//router정의
const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.render("./index", { user: "" });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기중`);
});
