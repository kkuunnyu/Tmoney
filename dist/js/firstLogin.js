window.onload = () => { };
const authToken = sessionStorage.getItem("authToken");

if (!authToken) {
  alert("로그인이 필요합니다.");
  window.location.href = "http://localhost:3000";
} else {
  //로그아웃
  document.querySelector(".logout").addEventListener("click", function () {
    sessionStorage.clear();
    window.location.href = "/";
  });
}
