const express = require("express");
const router = express.Router();
const UserSchema = require("../models/UserSchema");
const session = require("express-session"); //서버에 저장
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

router.use(session({ secret: "비밀코드shim", resave: true, saveUninitialized: false }));
router.use(passport.initialize());
router.use(passport.session());

//로그인 전략 짜기
passport.use(
  new LocalStrategy(
    {
      usernameField: "id", //field의 name값을 적는 것
      passwordField: "password",
      session: true,
      passReqToCallback: false,
    },
    async (id, password, done) => {
      try {
        const userInfo = await UserSchema.findOne({ id: id, password: password }).exec();
        console.log("로그인 성공");
        if (userInfo) {
          return done(null, userInfo);
          //done(첫번째 매개변수, 두번째 매개변수)
          //첫번째 매개변수: 서버에러
          //두번째는 성공했을 때 보내주는 변수
          //세번째는 임의로 실패를 만들고 싶을때
        } else {
          return done(null, false, { message: "id 또는 password를 확인해 주세요" });
          //done(첫번째 매개변수, 두번째 매개변수)
          //첫번째 매개변수: 서버에러
          //두번째는 성공했을 때 보내주는 변수
          //세번째는 서버개발자가 임의로 실패를 전달할때...
        }
      } catch {
        return done(null, false, { message: "id 또는 password를 확인해 주세요" });
      }
    }
  )
);

//userInfo값이 serializeUser (user)로 간다
passport.serializeUser((user, done) => {
  console.log("여기는 로그인 할때 한번만 거쳐간다");
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log("여기는 매번 거쳐간다.");
  UserSchema.findOne({ id: id })
    .then((result) => {
      done(null, result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/join", (req, res) => {
  //req.user는 세션에 저장되어 있다.
  //console.log("join===", req.user);
  if (req.user) {
    res.send(`<script>alert("로그인 되어 있습니다."); location.href="/";</script>`);
  } else {
    res.render("./user/join", { userInfo: req.user });
  }
});

//db선택 oracle, mySql(<- sql을 배워야 한다.) mongo
//연결을 한다.
//밀어넣기
//결과받기

router.post("/join", async (req, res) => {
  //post는 client에서 넘어오는 데이터를 받아서 처리하고 그 결과를 리턴해주는 것
  //console.log("form 태그에 있는 action에 적힌 주소로 데이터 넘어옴");
  const id = req.body.id;
  const password = req.body.password;
  const phone = req.body.phone;
  const address = req.body.address;
  const name = req.body.name;
  //const gender = req.body.gender;
  //const sido = req.body.sido;
  //const interest = req.body.interest;
  // console.log("id===", id);
  // console.log("password===", password);
  // console.log("phone===", phone);
  // console.log("address===", address);
  // console.log("gender===", gender);
  // console.log("sido===", sido);
  // console.log("interest===", interest);

  const insertUser = new UserSchema({
    id: id,
    password: password,
    name: name,
    phone: phone,
    address: address,
  });
  //console.log(insertUser.save()); //save를 하면 promise를 리턴한다. 그에 then을 사용
  /*
  insertUser
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      //console.log(err);
      res.send(`<script>alert("알수없는 오류로 회원가입이 되지 않았습니다"); location.href="/user/join";</script>`); //node에서는 이렇게 경고창을 띄어야 한다.
    });
    */
  //async/await로 쓸때는 아래와 같이 쓴다. try& catch 위에 function앞에 async넣어주고..
  try {
    const result = await insertUser.save();
    console.log(result);
    res.redirect("/");
  } catch {
    res.send(`<script>alert("알수없는 오류로 회원가입이 되지 않았습니다"); location.href="/user/join";</script>`);
  }
});

router.get("/login", (req, res) => {
  if (req.user) {
    res.send(`<script>alert("로그인 되어 있습니다."); location.href="/";</script>`);
  } else {
    res.render("./user/login", { userInfo: req.user });
  }
});

//middle ware
router.get("/info", isNotLogged, (req, res) => {
  // const id = req.query.id;
  // try {
  //   const userInfo = await UserSchema.findOne({ id: id });
  //   res.render("./user/info", { userInfo: userInfo });
  // } catch {}
  //console.log(req.user);
  if (req.user) {
    res.render("./user/info", { userInfo: req.user });
  } else {
    res.send(`<script>alert("로그인 먼저 하셔야 합니다"); location.href="/user/login";</script>`);
  }
});

//async. await 로 바꾸기
/*
router.post("/login", async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  console.log(id, "===", password);
  //find는 다 찾기 배열을 리턴한다.
  //findOne은 하나만 찾기 오브젝트를 리턴한다.
  try {
    const userInfo = await UserSchema.findOne({ id: id, password: password }).exec();
    res.render("./index", { user: userInfo.name, id: userInfo.id });
  } catch {
    res.send("end");
  }
});
*/

//passport로 로그인을 하면 자동으로 req.user 정보가 생긴다.
router.post("/login", passport.authenticate("local", { failureRedirect: "/user/login", successRedirect: "/user/info" }), (req, res) => {});

router.get("/list", (req, res) => {
  res.render("./user/list"); //view폴더를 기준으로 한다.
});

router.get("/logout", (req, res) => {
  if (req.user) {
    req.session.destroy();
    res.redirect("/");
  }
});

//미들웨어: 필요한 곳에 넣으면 된다.
function isLogged(req, res, next) {
  //passport에서 로그인 성공하면 자동으로 req.user를 생성한다.
  if (!req.user) {
    next();
  } else {
    res.send(`<script>alert("로그인 되어 있습니다"); location.href="/";</script>`);
  }
}

function isNotLogged(req, res, next) {
  //passport에서 로그인 성공하면 자동으로 req.user를 생성한다.
  if (req.user) {
    next();
  } else {
    res.send(`<script>alert("로그인 먼저 하셔야 합니다"); location.href="/user/login";</script>`);
  }
}

module.exports = router;
