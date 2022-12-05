const mongoose = require("mongoose");

/*
//Schema 정해진 형식으로 데이터 넣겠다.
mongoose.Schema({
  id: String,
  password: String,
  name: String,
  phone: String,
  address: String,
  date: Date,
});
*/

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    require: true, //무조건 입력이 되어야
    unique: true, //중복도지 않게 해준다
  },
  password: {
    type: String,
    require: true,
  },
  name: String,
  phone: String,
  address: String,
  date: {
    type: Date,
    default: Date.now, //따로 입력받지 않아도 알아서 생성
  },
});

//module.exports = mongoose.model("User", UserSchema); //내보내는 것
//아래와 같은 것
const User = mongoose.model("User", UserSchema); //User는 dbName안에 table이다. (Users라는 컬렉션이 생성! 복수형으로 생긴다)
module.exports = User;
