console.log("클라이언트");
const btnAll = document.querySelector(".btn-all");
const gnb = document.querySelector("#gnb");
btnAll.addEventListener("click", function () {
  this.classList.toggle("on");
  gnb.classList.toggle("on");
});

