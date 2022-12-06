const express = require("express");
const app = express();
const path = require("path");
const db = require("./db/db");

const session = require("express-session"); //서버에 저장
const passport = require("passport");
app.use(session({ secret: "비밀코드shim", resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.set("port", process.env.PORT || 8081);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

//app.set("views", path.join(__dirname, "ejs"));

const PORT = app.get("port");
//ejs, pug(jade)
app.set("view engine", "ejs"); //ejs는 html에 data를 쉽게 쓰기 위해 사용.

//session(서버에 저장) vs cookie(클라이언트에 저장)

//router정의
const userRouter = require("./routes/user");
app.use("/user", userRouter);

app.get("/", (req, res) => {
  //console.log(req.user);
  res.render("./index", { userInfo: req.user });
});

app.listen(PORT, () => {
  console.log(`${PORT}에서 서버 대기중`);
});
