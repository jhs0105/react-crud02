//서버 시간 제일 많이 잡아 먹는거
//1. 서버에서 db 연결
//2. query 날리기
//3. 결과 받기
//4. 받은 결과를 서버에 넘겨주기
//5. client에 넘ㅈ겨주기

//db안에 collection생성 되는데 dbName안주면 test로 생기고, dbname주면 dbname으로 생긴다.
const mongoose = require("mongoose");

const db = mongoose
  .connect("mongodb+srv://jh0105:12345@cluster0.ywhu9rb.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "front-text", //dbname안쓰면 test로 생긴다.
  })
  .then(() => {
    console.log("db연결 성공");
  })
  .catch(() => {
    console.log(err);
  });

module.exports = db;
