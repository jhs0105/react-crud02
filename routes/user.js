const express = require("express");
const router = express.Router();
const UserSchema = require("../models/UserSchema");

router.get("/join", (req, res) => {
  //template engine
  //서버에서 데이터를 실어 보내다.
  res.render("./user/join");
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
  res.render("./user/login");
});
router.get("/info", async (req, res) => {
  const id = req.query.id;
  try {
    const userInfo = await UserSchema.findOne({ id: id });
    res.render("./user/info", { userInfo: userInfo });
  } catch {}
});

//async. await 로 바꾸기
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

  /*
  const isLogged = UserSchema.findOne({ id: id, password: password }).exec(); //promise가 리턴됨
  isLogged
    .then((result) => {
      console.log("result===", result);
      // if (result.length > 0) {
      res.render("./index", { user: result[0].name });
      // }
    })
    .catch((err) => {
      console.log(err);
    });
  res.send("end");
  */
});

router.get("/list", (req, res) => {
  res.render("./user/list"); //view폴더를 기준으로 한다.
});

module.exports = router;
