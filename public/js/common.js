const header = $("#header");
const gnb = $("#gnb");
const btnTop = $(".btn-top");
$(window).on("scroll", function () {
  if ($(window).scrollTop() > 0) {
    header.addClass("on");
  } else {
    header.removeClass("on");
  }
  if ($(window).scrollTop() > 500) {
    btnTop.addClass("on");
  } else {
    btnTop.removeClass("on");
  }
});
btnTop.on("click", function () {
  gsap.to(window, { scrollTo: 100, duration: 1 });
});

$(".family-site button").on("click", function () {
  $(".family-site").toggleClass("on");
});
const lnbMenu = $("#lnb .lnb-box > a");
lnbMenu.on("click", function (e) {
  e.preventDefault();
  const siblings = $(this).next();
  siblings.stop().slideToggle();
});

const btnAll = $(".all-menu");
const depth01 = $("#gnb .depth01");
btnAll.on("click", function () {
  gnb.toggleClass("on");
  const icon = $(this).find("i");
  if (gnb.hasClass("on")) {
    icon.removeClass("fa-bars").addClass("fa-xmark");
  } else {
    icon.removeClass("fa-xmark").addClass("fa-bars");
  }
});

$(window).on("resize", function () {
  const w = $(window).outerWidth();
  if (w > 1280) {
    $("html").addClass("pc").removeClass("m");
    $("#gnb .depth02").removeAttr("style");
    $("#gnb").removeClass("on");
    const icon = $(".all-menu i");
    icon.removeClass("fa-xmark").addClass("fa-bars");
  } else {
    $("html").addClass("m").removeClass("pc");
  }
});

$(window).trigger("resize");

depth01.on("click", function (e) {
  if ($("html").hasClass("m")) {
    const depth02 = $(this).next();
    const siblings = $(this).parent().siblings().find(".depth02");
    const siblingsDepth01 = $(this).parent().siblings().find(".depth01");
    $(this).toggleClass("on");
    siblingsDepth01.removeClass("on");
    siblings.slideUp();
    if (depth02.length > 0) {
      e.preventDefault();
      depth02.stop().slideToggle();
    }
  }
});
