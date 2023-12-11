//로그아웃
document.querySelector(".logout").addEventListener("click", function () {
  sessionStorage.clear();
  window.location.href = "/";
});
